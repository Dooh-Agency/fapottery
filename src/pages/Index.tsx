import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import MarcaPersonalSection from "@/components/home/MarcaPersonalSection";
import EspacioSection from "@/components/home/EspacioSection";
import ManifiestoSection from "@/components/home/ManifiestoSection";
import QuienSoySection from "@/components/home/QuienSoySection";

const Index = () => {
  return (
    <Layout>
      <SEO path="/" />
      <HeroSection />
      <MarcaPersonalSection />
      <EspacioSection />
      <ManifiestoSection />
      <QuienSoySection />
    </Layout>
  );
};

export default Index;
