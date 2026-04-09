import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type StatsCardProps = {
  label: string;
  value: string | number;
};

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-sm text-slate-600">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-4xl text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
