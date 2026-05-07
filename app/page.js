import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import FeaturedProperties from "@/components/public/FeaturedProperties";
import Categories from "@/components/public/Categories";
import Principles from "@/components/public/Principles";
import Localities from "@/components/public/Localities";
import Testimonials from "@/components/public/Testimonials";
import CallToAction from "@/components/public/CallToAction";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <FeaturedProperties />
        <Categories />
        <Principles />
        <Localities />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
