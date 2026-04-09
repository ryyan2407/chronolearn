import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function HeroSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="space-y-6 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">AI study workflow</p>
        <h1 className="max-w-3xl font-serif text-5xl leading-tight text-slate-900 sm:text-6xl">
          Learn history with context, not just memorization.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          Upload class notes or start from a historical topic, then generate quizzes and feedback focused on cause,
          continuity, and significance.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/upload">
            <Button size="lg">Generate a quiz</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">
              View dashboard
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-slate-900 text-stone-50">
        <CardContent className="space-y-6 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Example flow</p>
          <div className="space-y-4">
            {[
              "Upload a chapter PDF or paste revision notes",
              "Generate mixed MCQ and short-answer questions",
              "Review feedback tied to historical context"
            ].map((item, index) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="mb-2 text-xs text-amber-200">0{index + 1}</p>
                <p className="text-sm leading-6 text-stone-200">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
