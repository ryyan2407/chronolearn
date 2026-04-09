# ChronoLearn Frontend Setup

This frontend is a React + Vite + TypeScript client for the existing ChronoLearn Node.js API.

It is designed to:

- create material from a topic or PDF upload
- generate quizzes from stored material
- submit quiz attempts
- show dashboard and history views for the current backend data

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- TanStack Query
- React Router
- Axios
- shadcn-style component structure in `src/components/ui/`

## Project Layout

```txt
client/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   └── types/
├── .env.example
├── components.json
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── setup.md
```

## How To Run

From `/home/ryyan/chronolearn/client`:

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend expects the backend to be running separately.

Default API base URL:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Build Command

```bash
npm run build
```

This runs TypeScript checking and a production Vite build.

## Routing

Routes are defined in [src/routes/AppRouter.tsx](/home/ryyan/chronolearn/client/src/routes/AppRouter.tsx).

Current routes:

- `/` -> marketing home page
- `/dashboard` -> analytics overview and recent attempts
- `/upload` -> topic/PDF material creation and quiz generation
- `/quiz/:quizId` -> quiz-taking screen
- `/results/:attemptId` -> score summary and available review
- `/history` -> attempt list
- `/login` -> placeholder auth page
- `/register` -> placeholder auth page

## Data Flow

### 1. Shared API Client

[src/services/api.ts](/home/ryyan/chronolearn/client/src/services/api.ts) creates a shared Axios instance.

All service files use that instance:

- [src/services/materials.service.ts](/home/ryyan/chronolearn/client/src/services/materials.service.ts)
- [src/services/quiz.service.ts](/home/ryyan/chronolearn/client/src/services/quiz.service.ts)
- [src/services/attempts.service.ts](/home/ryyan/chronolearn/client/src/services/attempts.service.ts)
- [src/services/analytics.service.ts](/home/ryyan/chronolearn/client/src/services/analytics.service.ts)

### 2. Query + Mutation Hooks

TanStack Query is configured in [src/lib/queryClient.ts](/home/ryyan/chronolearn/client/src/lib/queryClient.ts).

Custom hooks wrap the main workflows:

- [src/hooks/useUploadMaterial.ts](/home/ryyan/chronolearn/client/src/hooks/useUploadMaterial.ts)
- [src/hooks/useGenerateQuiz.ts](/home/ryyan/chronolearn/client/src/hooks/useGenerateQuiz.ts)
- [src/hooks/useQuiz.ts](/home/ryyan/chronolearn/client/src/hooks/useQuiz.ts)
- [src/hooks/useSubmitAttempt.ts](/home/ryyan/chronolearn/client/src/hooks/useSubmitAttempt.ts)
- [src/hooks/useAttemptResults.ts](/home/ryyan/chronolearn/client/src/hooks/useAttemptResults.ts)

These hooks keep fetch logic out of page components and centralize cache invalidation.

### 3. Page-Level Flow

#### Home

[src/pages/HomePage.tsx](/home/ryyan/chronolearn/client/src/pages/HomePage.tsx) is a marketing/entry page.

It is built from reusable sections under:

- [src/components/home/](/home/ryyan/chronolearn/client/src/components/home)

#### Upload

[src/pages/UploadPage.tsx](/home/ryyan/chronolearn/client/src/pages/UploadPage.tsx) handles:

- topic material creation via `POST /materials/topic`
- PDF upload via `POST /materials/upload`
- quiz generation via `POST /quiz/generate`

Main UI pieces:

- [src/components/upload/TopicSelector.tsx](/home/ryyan/chronolearn/client/src/components/upload/TopicSelector.tsx)
- [src/components/upload/UploadDropzone.tsx](/home/ryyan/chronolearn/client/src/components/upload/UploadDropzone.tsx)

The flow is:

1. Create or upload material.
2. Store the returned `material.id` in local page state.
3. Generate a quiz from that material.
4. Navigate to `/quiz/:quizId`.

#### Quiz

[src/pages/QuizPage.tsx](/home/ryyan/chronolearn/client/src/pages/QuizPage.tsx) loads a quiz by id using `GET /quiz/:quizId`.

It renders one question at a time using:

- [src/components/quiz/QuestionCard.tsx](/home/ryyan/chronolearn/client/src/components/quiz/QuestionCard.tsx)
- [src/components/quiz/MCQQuestion.tsx](/home/ryyan/chronolearn/client/src/components/quiz/MCQQuestion.tsx)
- [src/components/quiz/ShortAnswerQuestion.tsx](/home/ryyan/chronolearn/client/src/components/quiz/ShortAnswerQuestion.tsx)

When the user submits:

1. the page sends `POST /attempts/submit`
2. the returned attempt object is passed into route state
3. the app navigates to `/results/:attemptId`

That route-state handoff matters because the current backend list endpoint does not expose full answer review data.

#### Results

[src/pages/ResultsPage.tsx](/home/ryyan/chronolearn/client/src/pages/ResultsPage.tsx) shows:

- score summary
- skill breakdown
- generated feedback
- question review

But there is an important backend limitation:

- `POST /attempts/submit` returns answer-level detail
- `GET /attempts` currently returns summary attempts only

Because of that, detailed per-question review is guaranteed immediately after submitting a quiz, but not when loading an old attempt from history.

The page handles this gracefully by showing a summary-only fallback when detailed answers are unavailable.

#### Dashboard

[src/pages/DashboardPage.tsx](/home/ryyan/chronolearn/client/src/pages/DashboardPage.tsx) combines:

- `GET /analytics/overview`
- `GET /attempts`

Current analytics keys from the backend are:

```json
{
  "materials": 0,
  "quizzes": 0,
  "attempts": 0
}
```

#### History

[src/pages/HistoryPage.tsx](/home/ryyan/chronolearn/client/src/pages/HistoryPage.tsx) renders the attempts list and links to the results route for each attempt.

## Layout System

Shared shell components live in:

- [src/components/layout/AppLayout.tsx](/home/ryyan/chronolearn/client/src/components/layout/AppLayout.tsx)
- [src/components/layout/Navbar.tsx](/home/ryyan/chronolearn/client/src/components/layout/Navbar.tsx)
- [src/components/layout/Sidebar.tsx](/home/ryyan/chronolearn/client/src/components/layout/Sidebar.tsx)
- [src/components/layout/PageContainer.tsx](/home/ryyan/chronolearn/client/src/components/layout/PageContainer.tsx)

Every main page uses `AppLayout`, which keeps the navigation and content spacing consistent.

## Styling

Tailwind is configured in:

- [tailwind.config.ts](/home/ryyan/chronolearn/client/tailwind.config.ts)
- [postcss.config.js](/home/ryyan/chronolearn/client/postcss.config.js)
- [src/styles/index.css](/home/ryyan/chronolearn/client/src/styles/index.css)

The current visual system uses:

- off-white stone background
- slate text
- amber accents
- rounded cards
- serif-forward typography for a more academic tone

## UI Components

The reusable UI primitives live under:

- [src/components/ui/button.tsx](/home/ryyan/chronolearn/client/src/components/ui/button.tsx)
- [src/components/ui/card.tsx](/home/ryyan/chronolearn/client/src/components/ui/card.tsx)
- [src/components/ui/input.tsx](/home/ryyan/chronolearn/client/src/components/ui/input.tsx)
- [src/components/ui/textarea.tsx](/home/ryyan/chronolearn/client/src/components/ui/textarea.tsx)
- [src/components/ui/progress.tsx](/home/ryyan/chronolearn/client/src/components/ui/progress.tsx)
- [src/components/ui/badge.tsx](/home/ryyan/chronolearn/client/src/components/ui/badge.tsx)

This follows the same separation you would use with shadcn/ui, even though the components were added manually instead of generated by the CLI.

## Shared Types

Main app types are defined in:

- [src/types/material.ts](/home/ryyan/chronolearn/client/src/types/material.ts)
- [src/types/quiz.ts](/home/ryyan/chronolearn/client/src/types/quiz.ts)
- [src/types/attempt.ts](/home/ryyan/chronolearn/client/src/types/attempt.ts)
- [src/types/api.ts](/home/ryyan/chronolearn/client/src/types/api.ts)

These files should stay aligned with the server response shapes.

## Current Limitations

- Auth pages are placeholders and are not wired to a real session flow yet.
- Historical results cannot always show answer-level review because `GET /attempts` is summary-only.
- No dedicated frontend test setup has been added yet.
- No form library is used yet; page state is local React state for speed and simplicity.

## Recommended Next Frontend Improvements

1. Add `GET /attempts/:attemptId` on the backend and switch results to a true detail query.
2. Add auth state and protected routes once backend auth is real.
3. Add a toast system for mutation success/error handling.
4. Add frontend tests for upload, quiz, and results flows.
5. Replace the manually added UI primitives with generated shadcn components if you want full CLI parity.
