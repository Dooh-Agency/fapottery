import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import EventPromoModal from "@/components/EventPromoModal";
import HeroSection from "@/components/home/HeroSection";
import MarcaPersonalSection from "@/components/home/MarcaPersonalSection";
import ServiciosSection from "@/components/home/ServiciosSection";
import EspacioSection from "@/components/home/EspacioSection";
import TestimoniosSection from "@/components/home/TestimoniosSection";
import ManifiestoSection from "@/components/home/ManifiestoSection";
import QuienSoySection from "@/components/home/QuienSoySection";

const Index = () => {
  return (
    <Layout>
      <SEO path="/" />
      <EventPromoModal />
      <HeroSection />
      <MarcaPersonalSection />
      <ServiciosSection />
      <EspacioSection />
      <TestimoniosSection />
      <ManifiestoSection />
      <QuienSoySection />
    </Layout>
  );
};

export default Index;
