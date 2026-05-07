import TemplateForm from "@/components/admin/TemplateForm";

export default async function Page({ params }) {
  const { id } = await params;
  return <TemplateForm id={id}/>;
}
