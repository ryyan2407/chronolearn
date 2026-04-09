# Prompt Design Notes

- Quiz generation should return JSON only.
- Short-answer generation should include rubric, expected points, and source context.
- Grading should be grounded with:
  - source context
  - question prompt
  - rubric
  - student answer
- Persist the rubric at quiz creation time so grading is stable across attempts.
- Reject or retry invalid model JSON before storing results.
