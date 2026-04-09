# ChronoLearn Project Status

This document summarizes the app's currently implemented features and the work completed so far.

## Current Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- File handling: PDF upload via multipart form-data
- AI integration: Groq-compatible OpenAI client with fallback behavior when keys are not configured for some flows

## Working Features

### Authentication

- User registration
- User login
- Session-based auth with HTTP-only cookies
- `GET /auth/me` current-user lookup
- Logout
- Route protection on the client for authenticated pages

### Materials

- Create study material from typed topic input
- Upload PDF files as study material
- Parse uploaded PDF content on the backend
- Store created materials in PostgreSQL
- List saved materials for the signed-in user

### Quiz Generation

- Generate a quiz from stored material
- Store generated quizzes and questions in PostgreSQL
- Support both MCQ and short-answer questions
- Save rubrics and source context for short-answer grading

### Quiz Taking

- Load a quiz by ID
- Render one question at a time
- Submit answers for grading
- Auto-grade MCQs
- Evaluate short-answer responses

### Results and Review

- Show attempt score summary
- Show generated feedback after submission
- Show question-level review immediately after submitting a quiz
- Persist attempts in the database
- View attempt history

### Analytics and Dashboard

- Dashboard overview for counts of materials, quizzes, and attempts
- Recent attempt/history views backed by saved data

### Frontend UX

- Marketing home page
- Protected app pages for dashboard, upload, quiz, results, and history
- Client API integration through shared Axios service
- Query/mutation handling through TanStack Query

## Current User Flow

The main implemented journey is:

1. Register or log in
2. Open the upload workspace
3. Create material from notes or upload a PDF
4. Generate a quiz from saved material
5. Complete the quiz
6. Review results
7. See previous attempts in history
8. View counts on the dashboard

## Work Completed So Far

### Documentation

- Replaced the root README with a practical local setup guide
- Added server startup instructions
- Added client startup instructions
- Added local database setup guidance
- Added troubleshooting guidance
- Added a missing `server/.env.example` file so the documented setup flow works

### Upload Page Fixes

- Fixed the PDF file picker so the `Choose file` button reliably opens the hidden file input
- Added drag-and-drop handling to the PDF dropzone
- Removed developer-facing API endpoint text from the upload page header
- Removed developer-facing API endpoint text from the topic input card
- Kept the upload page user-facing instead of exposing implementation details

## Known Working Pages

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/upload`
- `/quiz/:quizId`
- `/results/:attemptId`
- `/history`

## Current API Surface

Implemented backend areas:

- Auth
- Materials
- Quiz
- Attempts
- Evaluation
- Analytics

See [api-spec.md](/home/ryyan/chronolearn/docs/api-spec.md) for the current endpoint list.

## Known Constraints

- Most app features depend on being authenticated because core routes and API endpoints are protected
- The backend requires PostgreSQL to be running
- The frontend and backend must both be started separately in development
- Detailed answer review is most reliable immediately after submission because older history views may only have summary-level attempt data depending on the route payload available at load time

## Remaining Work

These areas still need a full verification pass:

- End-to-end happy-path testing across the full app
- Auth edge cases and redirect behavior
- Error states and loading states across pages
- Old-attempt review completeness
- PDF edge cases and upload validation
- General UI polish and product-language cleanup where needed

## Latest Confirmed State

As of the latest pass:

- The PDF upload button on the upload page works
- PDF material upload succeeds
- Quiz generation from an uploaded PDF succeeds
- The upload page no longer shows raw backend endpoint descriptions to users
