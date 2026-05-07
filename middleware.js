import { NextResponse } from "next/server";
import { verifyJwtEdge } from "@/lib/auth-edge";

const SESSION_COOKIE = "verdant_admin_session";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const PUBLIC_ADMIN_API = ["/api/admin/login", "/api/admin/logout"];

const ADMIN_ONLY_PAGE_PREFIXES = [
  "/admin/properties",
  "/admin/projects",
  "/admin/testimonials",
  "/admin/templates",
  "/admin/users",
  "/admin/settings",
];

const MANAGER_OR_ADMIN_PAGE_PREFIXES = ["/admin/reports"];

const ADMIN_ONLY_API_PATTERNS = [
  /^\/api\/admin\/users(\/|$)/,
  /^\/api\/admin\/settings(\/|$)/,
  /^\/api\/admin\/templates(\/|\?|$)/,
  /^\/api\/admin\/testimonials(\/|\?|$)/,
];

const MANAGER_ADMIN_API_PATTERNS = [/^\/api\/admin\/reports(\/|$)/];

const VIEW_ONLY_FOR_NON_ADMIN_API = [
  /^\/api\/admin\/properties(\/|\?|$)/,
  /^\/api\/admin\/projects(\/|\?|$)/,
];

function matchesAny(path, patterns) {
  return patterns.some((p) => (p instanceof RegExp ? p.test(path) : path.startsWith(p)));
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  if (PUBLIC_ADMIN_PATHS.includes(pathname) || PUBLIC_ADMIN_API.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyJwtEdge(token);

  if (!payload) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = payload.role || "agent";

  if (isAdminPage) {
    if (matchesAny(pathname, ADMIN_ONLY_PAGE_PREFIXES) && role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (matchesAny(pathname, MANAGER_OR_ADMIN_PAGE_PREFIXES) && role === "agent") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isAdminApi) {
    if (matchesAny(pathname, ADMIN_ONLY_API_PATTERNS) && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (matchesAny(pathname, MANAGER_ADMIN_API_PATTERNS) && role === "agent") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (matchesAny(pathname, VIEW_ONLY_FOR_NON_ADMIN_API) && method !== "GET" && role !== "admin") {
      return NextResponse.json({ error: "Read-only access. Only admin can modify." }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
