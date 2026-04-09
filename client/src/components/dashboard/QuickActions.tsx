import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function QuickActions() {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link to="/upload">
          <Button>Create material</Button>
        </Link>
        <Link to="/history">
          <Button variant="outline">Open history</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
