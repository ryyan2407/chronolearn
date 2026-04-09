import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function QuickActions() {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">Create fresh study material, run another quiz, or jump back into your recent review flow.</p>
        <div className="flex flex-wrap gap-3">
        <Link to="/upload">
          <Button>New study material</Button>
        </Link>
        <Link to="/history">
          <Button variant="outline">Review past attempts</Button>
        </Link>
        </div>
      </CardContent>
    </Card>
  );
}
