import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret-change-me";
const COOKIE_NAME = "verdant_admin_session";
const TOKEN_EXPIRY = "7d";

export async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, 10);
}

export async function verifyPassword(plaintext, hash) {
  if (!plaintext || !hash) return false;
  return bcrypt.compare(plaintext, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return payload;
}

export async function getCurrentUserFull() {
  const u = await getCurrentUser();
  if (!u || !prisma) return null;
  try {
    const full = await prisma.user.findUnique({
      where: { id: u.sub },
      select: { id: true, email: true, name: true, phone: true, role: true, team: true, managerId: true, isActive: true, photo: true, designation: true },
    });
    if (!full || !full.isActive) return null;
    return full;
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles = null) {
  const user = await getCurrentUserFull();
  if (!user) return { user: null, error: "Unauthorized", status: 401 };
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return { user, error: "Forbidden", status: 403 };
  }
  return { user, error: null, status: 200 };
}

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  AGENT: "agent",
};

export const canManageInventory = (role) => role === ROLES.ADMIN;
export const canViewAllLeads = (role) => role === ROLES.ADMIN;
export const canViewTeamLeads = (role) => role === ROLES.ADMIN || role === ROLES.MANAGER;
export const canManageUsers = (role) => role === ROLES.ADMIN;
export const canManageSettings = (role) => role === ROLES.ADMIN;
export const canManageTemplates = (role) => role === ROLES.ADMIN;
export const canManageTestimonials = (role) => role === ROLES.ADMIN;
export const canViewReports = (role) => role === ROLES.ADMIN || role === ROLES.MANAGER;

export async function getLeadVisibilityFilter(user) {
  if (!user) return { id: "_none_" };
  if (user.role === ROLES.ADMIN) return {};
  if (user.role === ROLES.MANAGER) {
    if (!prisma) return { assignedToId: user.id };
    const reports = await prisma.user.findMany({
      where: { managerId: user.id },
      select: { id: true },
    });
    const ids = [user.id, ...reports.map((r) => r.id)];
    return { assignedToId: { in: ids } };
  }
  return { assignedToId: user.id };
}

export async function getRequestIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null
  );
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
