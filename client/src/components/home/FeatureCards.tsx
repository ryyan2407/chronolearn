import { Brain, FileText, LineChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    title: "Context-aware prompts",
    description: "Questions emphasize chronology, causation, and significance instead of isolated facts.",
    icon: Brain
  },
  {
    title: "Topic or PDF ingestion",
    description: "Start from a historical period, a chapter handout, or pasted notes without changing workflow.",
    icon: FileText
  },
  {
    title: "Actionable performance review",
    description: "See weak skill areas, generated feedback, and recent attempt history in one place.",
    icon: LineChart
  }
];

export function FeatureCards() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <Card key={title} className="bg-white/90">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
