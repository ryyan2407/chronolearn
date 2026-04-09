import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type MaterialSourceCardProps = {
  title: string;
  description: string;
};

export function MaterialSourceCard({ title, description }: MaterialSourceCardProps) {
  return (
    <Card className="bg-white/85">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
