import { suggestedTopics } from "../../lib/constants";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type TopicSelectorProps = {
  title: string;
  topic: string;
  sourceText: string;
  onTitleChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSourceTextChange: (value: string) => void;
  onPickTopic: (value: string) => void;
};

export function TopicSelector({
  title,
  topic,
  sourceText,
  onTitleChange,
  onTopicChange,
  onSourceTextChange,
  onPickTopic
}: TopicSelectorProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Create material from a topic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Material title" value={title} onChange={(event) => onTitleChange(event.target.value)} />
        <Input placeholder="Historical topic or period" value={topic} onChange={(event) => onTopicChange(event.target.value)} />
        <div className="flex flex-wrap gap-2">
          {suggestedTopics.map((item) => (
            <button
              key={item}
              className="rounded-full border border-stone-300 px-3 py-1 text-xs text-slate-700 transition hover:border-amber-500 hover:text-amber-700"
              type="button"
              onClick={() => onPickTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Paste study notes, source context, or a summary of the topic..."
          value={sourceText}
          onChange={(event) => onSourceTextChange(event.target.value)}
        />
        <p className="text-xs text-slate-500">Use this when you want to turn typed notes or a study summary into quiz material.</p>
      </CardContent>
    </Card>
  );
}
