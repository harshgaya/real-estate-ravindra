import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

let _configured = false;

function configure() {
  if (_configured) return true;
  if (!PUBLIC_KEY || !PRIVATE_KEY) return false;
  try {
    webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
    _configured = true;
    return true;
  } catch {
    return false;
  }
}

export const isPushConfigured = () => !!(PUBLIC_KEY && PRIVATE_KEY);
export const getPublicKey = () => PUBLIC_KEY;

export async function sendPushToUser(userId, payload) {
  if (!configure() || !prisma) return { sent: 0, failed: 0 };
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  let sent = 0, failed = 0;
  const toDelete = [];
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.authKey },
        },
        JSON.stringify(payload)
      );
      sent++;
    } catch (err) {
      failed++;
      if (err.statusCode === 404 || err.statusCode === 410) {
        toDelete.push(sub.id);
      }
    }
  }
  if (toDelete.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: toDelete } } });
  }
  return { sent, failed };
}

export async function sendPushToUsers(userIds, payload) {
  let sent = 0, failed = 0;
  for (const uid of userIds) {
    const r = await sendPushToUser(uid, payload);
    sent += r.sent;
    failed += r.failed;
  }
  return { sent, failed };
}
