import { CTASection } from "../components/home/CTASection";
import { FeatureCards } from "../components/home/FeatureCards";
import { HeroSection } from "../components/home/HeroSection";
import { HowItWorks } from "../components/home/HowItWorks";
import { AppLayout } from "../components/layout/AppLayout";
import { SectionHeader } from "../components/common/SectionHeader";

export function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-16">
        <HeroSection />
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Why it works"
            title="Built for historical reasoning"
            description="ChronoLearn uses your existing material as the source of truth, then turns it into a guided quiz workflow."
          />
          <FeatureCards />
        </div>
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Workflow"
            title="From source material to targeted review"
            description="Start with one topic or source document, turn it into a quiz, and use each result to focus the next round of study."
          />
          <HowItWorks />
        </div>
        <CTASection />
      </div>
    </AppLayout>
  );
}
