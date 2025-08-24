import MainLayout from "../layouts/MainLayout";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import HowItWorksSection from "./HowItWorksSection";
import CTASection from "./CTASection";
import JobsSection from "./JobsSection";
import ProfessionsSection from "./ProfessionsSection";

export default function Landing() {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <ProfessionsSection />
      <HowItWorksSection />
      <JobsSection />
      <CTASection />
    </MainLayout>
  );
}
