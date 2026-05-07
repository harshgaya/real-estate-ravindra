"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import LeadDrawer from "@/components/admin/LeadDrawer";

export default function LeadDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  return (
    <div className="min-h-[calc(100vh-100px)]">
      <LeadDrawer leadId={id} onClose={() => router.push("/admin/leads")}/>
    </div>
  );
}
