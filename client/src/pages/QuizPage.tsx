import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { AppLayout } from "../components/layout/AppLayout";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { QuizHeader } from "../components/quiz/QuizHeader";
import { QuizNavigation } from "../components/quiz/QuizNavigation";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { useQuiz } from "../hooks/useQuiz";
import { useSubmitAttempt } from "../hooks/useSubmitAttempt";

const getQuizDraftStorageKey = (quizId: string) => `chronolearn.quiz.${quizId}.draft`;

export function QuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const quizQuery = useQuiz(quizId);
  const submitAttemptMutation = useSubmitAttempt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const quiz = quizQuery.data;
  const draftStorageKey = quiz ? getQuizDraftStorageKey(quiz.id) : "";
  const answeredCount = useMemo(
    () => (quiz ? quiz.questions.filter((item) => Boolean(answers[item.id]?.trim())).length : 0),
    [answers, quiz]
  );
  const unansweredCount = quiz ? quiz.questions.length - answeredCount : 0;

  useEffect(() => {
    if (hasLoadedDraft || !quiz) {
      return;
    }

    const rawDraft = window.localStorage.getItem(draftStorageKey);

    if (rawDraft) {
      try {
        const parsedDraft = JSON.parse(rawDraft) as Record<string, string>;
        setAnswers(parsedDraft);
      } catch {
        window.localStorage.removeItem(draftStorageKey);
      }
    }

    setHasLoadedDraft(true);
  }, [draftStorageKey, hasLoadedDraft]);

  useEffect(() => {
    if (!hasLoadedDraft || !quiz) {
      return;
    }

    window.localStorage.setItem(draftStorageKey, JSON.stringify(answers));
  }, [answers, draftStorageKey, hasLoadedDraft]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (submitAttemptMutation.isPending || answeredCount === 0) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [answeredCount, submitAttemptMutation.isPending]);

  if (quizQuery.isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner label="Loading your quiz..." />
      </AppLayout>
    );
  }

  if (quizQuery.isError || !quiz) {
    return (
      <AppLayout>
        <ErrorState message="Quiz data could not be loaded." />
      </AppLayout>
    );
  }

  const question = quiz.questions[currentIndex];

  const updateAnswer = (value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  };

  const handleSubmit = async () => {
    const unansweredQuestions = quiz.questions
      .map((item, index) => ({ index, answered: Boolean(answers[item.id]?.trim()) }))
      .filter((item) => !item.answered)
      .map((item) => item.index + 1);

    const confirmationMessage =
      unansweredQuestions.length === 0
        ? `Submit your attempt with all ${quiz.questions.length} questions answered?`
        : `You still have ${unansweredQuestions.length} unanswered question${unansweredQuestions.length === 1 ? "" : "s"} (${unansweredQuestions.join(", ")}). Submit anyway?`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    const attempt = await submitAttemptMutation.mutateAsync({
      quizId: quiz.id,
      answers: quiz.questions.map((item) => ({
        questionId: item.id,
        answer: answers[item.id] ?? ""
      }))
    });

    window.localStorage.removeItem(draftStorageKey);
    navigate(`/results/${attempt.id}`, {
      state: {
        attempt
      }
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <QuizHeader title={quiz.title} totalQuestions={quiz.questions.length} answeredQuestions={answeredCount} />
        <QuizProgress
          currentIndex={currentIndex}
          total={quiz.questions.length}
          answers={answers}
          questionIds={quiz.questions.map((item) => item.id)}
          onJump={setCurrentIndex}
        />
        <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 px-5 py-4 text-sm leading-6 text-slate-600">
          Move through the questions in order or jump ahead using the progress chips. You can submit with blanks if needed, but unanswered questions will receive no marks.
        </div>
        <QuestionCard question={question} value={answers[question.id] ?? ""} onChange={updateAnswer} />
        <QuizNavigation
          canGoBack={currentIndex > 0}
          isLastQuestion={currentIndex === quiz.questions.length - 1}
          isSubmitting={submitAttemptMutation.isPending}
          unansweredCount={unansweredCount}
          onBack={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
          onNext={() => setCurrentIndex((index) => Math.min(index + 1, quiz.questions.length - 1))}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}
