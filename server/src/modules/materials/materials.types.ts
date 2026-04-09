export type MaterialResponse = {
  id: string;
  title: string;
  type: "PDF" | "TOPIC";
  topic: string | null;
  createdAt: Date;
};
