import MainLayout from "../layouts/MainLayout";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import CategoriesSection from "./CategoriesSection";
import HowItWorksSection from "./HowItWorksSection";
import CTASection from "./CTASection";
import JobsSection from "./JobsSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import FeaturesSection from "./FeaturesSection";

export default function Landing() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <JobsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </MainLayout>
  );
}
