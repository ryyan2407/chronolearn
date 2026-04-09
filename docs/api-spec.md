# ChronoLearn API

Base path: `/api`

## `POST /materials/topic`

Create study material from a manual topic payload.
Requires an authenticated session cookie.

```json
{
  "title": "French Revolution",
  "topic": "French Revolution",
  "sourceText": "Long source text or study notes..."
}
```

## `POST /materials/upload`

Multipart form-data upload.
Requires an authenticated session cookie.

- `file`: PDF file
- `title`: optional material title

## `GET /materials`

List the authenticated user's stored materials.

## `POST /quiz/generate`

Generate and persist a quiz from a material.
Requires an authenticated session cookie.

```json
{
  "materialId": "material_id",
  "title": "French Revolution Quiz",
  "mcqCount": 3,
  "shortAnswerCount": 2
}
```

Response includes quiz metadata and persisted questions. Short-answer questions carry saved `rubric` and `sourceContext`.

## `GET /quiz`

List the authenticated user's quizzes with questions.

## `GET /quiz/:quizId`

Fetch one of the authenticated user's quizzes with questions.

## `POST /attempts/submit`

Submit answers, auto-grade MCQs, evaluate short answers, store the attempt, and return feedback.
Requires an authenticated session cookie.

```json
{
  "quizId": "quiz_id",
  "answers": [
    {
      "questionId": "question_1",
      "answer": "Third Estate"
    },
    {
      "questionId": "question_2",
      "answer": "Economic inequality and taxation increased resentment..."
    }
  ]
}
```

Response includes `totalScore`, `maxScore`, and per-question feedback inside `answers`.

## `GET /attempts`

List the authenticated user's saved attempts.

## `POST /evaluation/short-answer`

Standalone evaluation endpoint for testing the short-answer grader.

```json
{
  "prompt": "What conditions contributed to the French Revolution?",
  "rubric": {
    "accuracy": "Mention accurate causes.",
    "context": "Explain late 18th-century France.",
    "causation": "Connect causes to the revolution."
  },
  "sourceContext": "Economic inequality, taxation, and monarchical weakness...",
  "answer": "Heavy taxation and inequality led to unrest.",
  "marks": 6
}
```

## `POST /auth/register`

Create a user account. Passwords are hashed before storage.

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "supersecure123"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-03-25T12:00:00.000Z"
  }
}
```

## `POST /auth/login`

Validate credentials and return the public user payload.

```json
{
  "email": "ada@example.com",
  "password": "supersecure123"
}
```

Successful login and registration both set an HTTP-only session cookie.

## `GET /auth/me`

Return the currently authenticated user from the active session cookie.

## `POST /auth/logout`

Clear the active session cookie.

## `GET /analytics/overview`

Return per-user counts for materials, quizzes, and attempts.
