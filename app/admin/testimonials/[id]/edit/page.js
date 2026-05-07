import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function Page({ params }) {
  const { id } = await params;
  return <TestimonialForm id={id}/>;
}
