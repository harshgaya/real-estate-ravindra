// Edge-runtime auth check for middleware.
// Uses Web Crypto API for JWT verification (no Node dependencies).

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret-change-me";

function base64UrlDecode(str) {
  // Convert base64url to base64
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return atob(s);
}

async function verifyHmac(data, signature, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // Convert base64url signature to bytes
  const sigBytes = Uint8Array.from(base64UrlDecode(signature), (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
}

export async function verifyJwtEdge(token) {
  if (!token) return null;
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const data = `${headerB64}.${payloadB64}`;
    const valid = await verifyHmac(data, sigB64, JWT_SECRET);
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}
