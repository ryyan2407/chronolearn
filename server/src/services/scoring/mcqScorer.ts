export const scoreMcqAnswer = (correctAnswer: string | null, studentAnswer: string, marks: number) => {
  const isCorrect =
    (correctAnswer ?? "").trim().toLowerCase() === studentAnswer.trim().toLowerCase();

  return {
    score: isCorrect ? marks : 0,
    feedback: isCorrect ? "You got this one right." : `Your answer was not correct. The correct answer was: ${correctAnswer ?? "N/A"}.`
  };
};
