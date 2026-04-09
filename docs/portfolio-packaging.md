# ChronoLearn Packaging

## Resume Bullets

- Built ChronoLearn, a full-stack history learning platform using React, Vite, Node.js, Express, Prisma, and PostgreSQL to turn uploaded PDFs or topic notes into quizzes with persisted scoring and feedback.
- Designed and hardened an end-to-end quiz workflow covering authentication, material ingestion, quiz generation, attempt submission, analytics, and persisted review, including validation for malformed uploads and partial-answer handling.
- Added automated demo-readiness checks with API smoke coverage and Playwright browser E2E tests for the full happy path from registration through quiz completion, history review, and logout.

## Portfolio Paragraph

ChronoLearn is a full-stack learning app built around historical reasoning rather than flashcard-style recall. Users can upload a PDF or create study material from their own notes, generate a quiz from that material, complete a mixed MCQ and short-answer assessment, and revisit detailed feedback later through persisted results and history views. I built the frontend in React and Vite, the backend in Express with Prisma and PostgreSQL, and added both API-level and browser-level validation so the demo flow is stable enough to present as a portfolio project.

## Short Architecture Summary

- React + Vite client handles auth, upload, quiz-taking, results, dashboard, and history flows.
- Express API exposes auth, materials, quiz, attempts, evaluation, and analytics modules.
- Prisma persists users, materials, chunks, quizzes, questions, attempts, and answers in PostgreSQL.
- PDF ingestion extracts text, chunks it for reuse, and feeds quiz generation.
- Quiz results store answer-level feedback so old attempts can be revisited directly.

## Demo Assets

- README screenshots live in [docs/screenshots](/home/ryyan/chronolearn/docs/screenshots)
- Demo checklist lives in [demo-ready-checklist.md](/home/ryyan/chronolearn/docs/demo-ready-checklist.md)
- Project status lives in [project-status.md](/home/ryyan/chronolearn/docs/project-status.md)
