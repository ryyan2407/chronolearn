import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SectionHeader } from "../components/common/SectionHeader";
import { AppLayout } from "../components/layout/AppLayout";
import { MaterialSourceCard } from "../components/upload/MaterialSourceCard";
import { TopicSelector } from "../components/upload/TopicSelector";
import { UploadDropzone } from "../components/upload/UploadDropzone";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useGenerateQuiz } from "../hooks/useGenerateQuiz";
import { useUploadMaterial } from "../hooks/useUploadMaterial";
import { queryKeys } from "../lib/queryKeys";
import { parseApiErrorMessage } from "../services/api";
import { materialsService } from "../services/materials.service";

const MAX_PDF_SIZE_MB = 10;

export function UploadPage() {
  const navigate = useNavigate();
  const { topicMutation, pdfMutation } = useUploadMaterial();
  const generateQuizMutation = useGenerateQuiz();
  const materialsQuery = useQuery({
    queryKey: queryKeys.materials.all,
    queryFn: materialsService.list
  });

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [topicError, setTopicError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [quizError, setQuizError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const materialOptions = materialsQuery.data ?? [];
  const latestMaterialId = useMemo(() => materialOptions[0]?.id ?? "", [materialOptions]);
  const activeMaterialId = selectedMaterialId || latestMaterialId;

  const handleTopicSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTopicError("");
    setPdfError("");
    setQuizError("");
    setStatusMessage("");

    const normalizedTitle = title.trim() || topic.trim();
    const normalizedTopic = topic.trim();
    const normalizedSourceText = sourceText.trim();

    if (normalizedTopic.length < 3) {
      setTopicError("Add a topic name with at least 3 characters.");
      return;
    }

    if (normalizedSourceText.length < 20) {
      setTopicError("Add at least 20 characters of notes or source context.");
      return;
    }

    try {
      const material = await topicMutation.mutateAsync({
        title: normalizedTitle,
        topic: normalizedTopic,
        sourceText: normalizedSourceText
      });
      setSelectedMaterialId(material.id);
      setQuizTitle(`${material.title} Quiz`);
      setStatusMessage(`Saved "${material.title}". You can generate a quiz now.`);
    } catch (error) {
      setTopicError(parseApiErrorMessage(error, "Topic material could not be created."));
    }
  };

  const handlePdfSubmit = async () => {
    setTopicError("");
    setPdfError("");
    setQuizError("");
    setStatusMessage("");

    if (!selectedFile) {
      setPdfError("Choose a PDF before uploading.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setPdfError("Only PDF files are supported right now.");
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      setPdfError(`Choose a PDF smaller than ${MAX_PDF_SIZE_MB} MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (title.trim()) {
      formData.append("title", title.trim());
    }

    try {
      const material = await pdfMutation.mutateAsync(formData);
      setSelectedMaterialId(material.id);
      setQuizTitle(`${material.title} Quiz`);
      setSelectedFile(null);
      setStatusMessage(`Uploaded "${material.title}". You can generate a quiz now.`);
    } catch (error) {
      setPdfError(parseApiErrorMessage(error, "PDF upload failed."));
    }
  };

  const handleGenerateQuiz = async () => {
    setTopicError("");
    setPdfError("");
    setQuizError("");
    setStatusMessage("");

    if (!activeMaterialId) {
      setQuizError("Create or choose a material before generating a quiz.");
      return;
    }

    const normalizedQuizTitle = quizTitle.trim() || "ChronoLearn Quiz";

    try {
      const quiz = await generateQuizMutation.mutateAsync({
        materialId: activeMaterialId,
        title: normalizedQuizTitle,
        mcqCount: 3,
        shortAnswerCount: 2
      });

      setStatusMessage(`Generated "${quiz.title}". Opening quiz now.`);
      navigate(`/quiz/${quiz.id}`);
    } catch (error) {
      setQuizError(parseApiErrorMessage(error, "Quiz generation failed."));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Material intake"
          title="Create study material, then turn it into a quiz"
          description="Start with notes or a source PDF, save the material, then turn it into a practice quiz in the same workspace."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <MaterialSourceCard
            title="Topic-based input"
            description="Best for typed notes, chapter summaries, or a focused historical theme you want to turn into a quiz quickly."
          />
          <MaterialSourceCard
            title="PDF upload"
            description="Best when you already have lecture handouts or textbook extracts and want ChronoLearn to turn them into quiz-ready study material."
          />
        </div>

        {materialsQuery.isError ? <ErrorState message="Saved materials could not be loaded right now." /> : null}
        {materialsQuery.isLoading ? <LoadingSpinner label="Loading your saved materials..." /> : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <form className="space-y-4" onSubmit={handleTopicSubmit}>
            <TopicSelector
              title={title}
              topic={topic}
              sourceText={sourceText}
              onTitleChange={setTitle}
              onTopicChange={setTopic}
              onSourceTextChange={setSourceText}
              onPickTopic={(value) => {
                setTopic(value);
                if (!title) {
                  setTitle(value);
                }
              }}
            />
            {topicError ? <ErrorState message={topicError} /> : null}
            <Button type="submit" disabled={topicMutation.isPending || !topic || !sourceText}>
              {topicMutation.isPending ? "Saving material..." : "Save topic material"}
            </Button>
          </form>

          <div className="space-y-4">
            <UploadDropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} isPending={pdfMutation.isPending} />
            {pdfError ? <ErrorState message={pdfError} /> : null}
            <Button type="button" onClick={handlePdfSubmit} disabled={!selectedFile || pdfMutation.isPending}>
              {pdfMutation.isPending ? "Uploading PDF..." : "Upload and save PDF"}
            </Button>
          </div>
        </div>

        {statusMessage ? (
          <Card className="border-amber-500 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">{statusMessage}</p>
            </CardContent>
          </Card>
        ) : null}

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Generate a quiz from stored material</CardTitle>
            <p className="text-sm leading-6 text-slate-600">Pick any saved material below and create a quiz when you are ready to practice.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Quiz title, for example French Revolution Review"
              value={quizTitle}
              onChange={(event) => setQuizTitle(event.target.value)}
            />
            <select
              className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 text-sm"
              value={activeMaterialId}
              onChange={(event) => setSelectedMaterialId(event.target.value)}
            >
              <option value="">Select material</option>
              {materialOptions.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.title}
                </option>
              ))}
            </select>
            {quizError ? <ErrorState message={quizError} /> : null}
            <Button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={generateQuizMutation.isPending || !activeMaterialId || materialsQuery.isLoading}
            >
              {generateQuizMutation.isPending ? "Building quiz..." : "Generate quiz"}
            </Button>
          </CardContent>
        </Card>

        {materialsQuery.data && materialsQuery.data.length === 0 ? (
          <EmptyState
            title="No study material yet"
            description="Create your first topic summary or upload a PDF above, then come back here to generate a quiz."
          />
        ) : null}
      </div>
    </AppLayout>
  );
}
