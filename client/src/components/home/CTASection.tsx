import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function CTASection() {
  return (
    <Card className="border-none bg-gradient-to-br from-amber-500 via-amber-400 to-orange-300 text-slate-950">
      <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-800/70">Ready to build the flow?</p>
          <h2 className="mt-2 font-serif text-4xl">Start with one topic, then expand into a full revision dashboard.</h2>
        </div>
        <Link to="/upload">
          <Button variant="secondary" size="lg" className="bg-slate-900 text-stone-50 hover:bg-slate-800">
            Open upload workspace
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
