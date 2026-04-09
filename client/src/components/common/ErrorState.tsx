import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50/70 shadow-none">
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-red-700">{message ?? "The request could not be completed."}</p>
      </CardContent>
    </Card>
  );
}
