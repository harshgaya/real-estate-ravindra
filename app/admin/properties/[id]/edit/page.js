import PropertyForm from "@/components/admin/PropertyForm";

export default async function Page({ params }) {
  const { id } = await params;
  return <PropertyForm id={id}/>;
}
