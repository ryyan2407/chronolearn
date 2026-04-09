export type Material = {
  id: string;
  title: string;
  type: "PDF" | "TOPIC";
  topic: string | null;
  createdAt: string;
};

export type CreateTopicMaterialInput = {
  title: string;
  topic: string;
  sourceText: string;
};
