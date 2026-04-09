export const formatFeedback = (
  strengths: string[],
  missingPoints: string[],
  fallback = "Your answer was evaluated."
): string => {
  const parts = [
    strengths.length ? `What you did well: ${strengths.join(" ")}` : "",
    missingPoints.length ? `What to improve in your answer: ${missingPoints.join(" ")}` : ""
  ].filter(Boolean);

  return parts.join(" ").trim() || fallback;
};
