# ChronoLearn Project Status

This document summarizes the app's current feature set, the work completed so far, and the latest verified state of the project.

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
- Auth state survives refresh through persisted session cookies

### Materials

- Create study material from typed topic input
- Upload PDF files as study material
- Parse uploaded PDF content on the backend
- Reject non-PDF uploads cleanly
- Reject oversized PDFs cleanly
- Reject unreadable or near-empty PDFs cleanly
- Store created materials in PostgreSQL
- List saved materials for the signed-in user

### Quiz Generation

- Generate a quiz from stored material
- Store generated quizzes and questions in PostgreSQL
- Support both MCQ and short-answer questions
- Save rubrics and source context for short-answer grading
- Fall back to local quiz generation logic if AI generation is unavailable or fails

### Quiz Taking

- Load a quiz by ID
- Render one question at a time
- Save in-progress answers in local draft storage
- Submit answers for grading
- Auto-grade MCQs
- Evaluate short-answer responses
- Allow partial submission with blank answers and grade them consistently

### Results and Review

- Show attempt score summary
- Show generated feedback after submission
- Show persisted question-level review from backend data
- Reload old attempts directly by URL
- Persist attempts in the database
- View attempt history

### Analytics and Dashboard

- Dashboard overview for counts of materials, quizzes, and attempts
- Recent attempt/history views backed by saved data
- Analytics update after successful submissions

### Frontend UX

- Marketing home page
- Protected app pages for dashboard, upload, quiz, results, and history
- Cleaner product-facing copy with internal endpoint language removed from user pages
- Shared API client and centralized API error parsing
- Query/mutation handling through TanStack Query
- More predictable query invalidation and cache seeding after mutations

## Current User Flow

The main implemented journey is:

1. Register or log in
2. Open the upload workspace
3. Create material from notes or upload a PDF
4. Generate a quiz from saved material
5. Complete the quiz
6. Review results
7. Revisit results later from history
8. See updated counts on the dashboard
9. Log out and get redirected away from protected pages

## Work Completed So Far

### Documentation

- Replaced the root README with a practical local setup guide
- Added server startup instructions
- Added client startup instructions
- Added local database setup guidance
- Added troubleshooting guidance
- Added a missing `server/.env.example` file so the documented setup flow works
- Added [demo-ready-checklist.md](/home/ryyan/chronolearn/docs/demo-ready-checklist.md)

### Upload Page Fixes

- Fixed the PDF file picker so the `Choose file` button reliably opens the hidden file input
- Added drag-and-drop handling to the PDF dropzone
- Removed developer-facing API endpoint text from the upload page header
- Removed developer-facing API endpoint text from the topic input card
- Added clearer upload validation messaging in the client

### Reliability and State Hardening

- Standardized API error responses around `message`, `code`, and optional `details`
- Added centralized client-side API error parsing
- Centralized TanStack Query keys in one shared module
- Seeded auth state immediately after login and registration
- Cleared app query state reliably on logout
- Seeded cached quiz and attempt detail after successful mutations
- Removed dependence on fragile route-state-only results data
- Ensured old attempts load persisted detail from the backend

### Validation and Backend Hardening

- Added backend file-type validation for uploads
- Added backend size-limit error handling for PDFs
- Added backend handling for malformed PDF parse failures
- Added backend checks for low-value topic input and unreadable PDF text
- Kept partial quiz submissions compatible with UI expectations
- Added cleaner zero-score handling for blank short-answer responses

### Demo Readiness

- Ran the happy path live against a real database and running backend
- Verified persisted attempt detail, history, analytics, and logout behavior
- Added automated integration coverage through `npm run demo:check`
- Added a repeatable generated PDF fixture inside the demo-check script

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

## Demo Verification

These flows have now been confirmed through live API checks:

- register
- session persistence via `GET /auth/me`
- topic material creation
- valid PDF upload
- quiz generation
- attempt submission
- persisted attempt-detail reload
- history retrieval
- analytics retrieval
- logout

These failure paths have also been confirmed:

- non-PDF upload rejection
- malformed or unreadable PDF rejection
- oversized PDF rejection
- partial blank-answer submission

Automated smoke/integration command:

```bash
cd /home/ryyan/chronolearn/server
npm run demo:check
```

## Known Constraints

- Most app features depend on being authenticated because core routes and API endpoints are protected
- The backend requires PostgreSQL to be running
- The frontend and backend must both be started separately in development
- The automated demo check assumes a reachable backend at `http://127.0.0.1:4000/api` unless `DEMO_CHECK_API_BASE_URL` is set
- The automated demo check depends on `gs` being available locally to generate a valid PDF fixture
- A fully browser-driven UI automation pass has not been added yet

## Remaining Work

The highest-value next steps are now narrower:

- Add browser-driven end-to-end UI automation if you want click-level regression coverage
- Do a final visual and UX polish pass across forms, loading states, and empty states
- Rotate and remove any committed secrets from tracked env files
- Tighten any remaining product copy and demo content

## Latest Confirmed State

As of the latest pass:

- The PDF upload button works
- Valid PDF uploads succeed
- Invalid, oversized, and unreadable PDFs fail cleanly
- Topic material creation works
- Quiz generation works
- Quiz submission works, including partial blank-answer submission
- Persisted results reload correctly from backend data
- History and dashboard counts update correctly
- Logout clears access to protected API state
- `npm run demo:check` passes against the live backend
