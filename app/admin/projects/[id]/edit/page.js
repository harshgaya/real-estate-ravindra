import ProjectForm from "@/components/admin/ProjectForm";

export default async function Page({ params }) {
  const { id } = await params;
  return <ProjectForm id={id}/>;
}
