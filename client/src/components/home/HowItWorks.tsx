const steps = [
  {
    title: "Build study material",
    description: "Create a topic summary or upload a PDF to store historical source text."
  },
  {
    title: "Generate a mixed quiz",
    description: "Choose MCQ and short-answer counts based on how deep you want the review to go."
  },
  {
    title: "Study the feedback",
    description: "Review scores, per-question notes, and weak areas to guide the next revision session."
  }
];

export function HowItWorks() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-[28px] border border-stone-200 bg-white/70 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Step 0{index + 1}</p>
          <h3 className="font-serif text-2xl text-slate-900">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
        </div>
      ))}
    </section>
  );
}
