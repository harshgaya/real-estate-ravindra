import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUserFull } from "@/lib/auth";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUserFull();
  return <AdminShell user={user}>{children}</AdminShell>;
}
