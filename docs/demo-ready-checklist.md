# Demo-Ready Checklist

Use this checklist before showing ChronoLearn to someone else.

Quick rerun:

```bash
cd /home/ryyan/chronolearn/server
npm run demo:check
```

## Happy Path

- Register a new account
- Refresh the page and confirm you stay signed in
- Upload a valid PDF and confirm the material is saved
- Create material from typed topic notes
- Generate a quiz from saved material
- Answer every question and submit
- Revisit results directly by URL
- Open history and review an old attempt
- Open dashboard and confirm counts update
- Log out and confirm protected pages redirect to login

## Validation

- Try uploading a non-PDF file and confirm the UI shows a clean error
- Try uploading a PDF larger than the supported limit and confirm the UI shows a clean error
- Try uploading a PDF with little or no readable text and confirm the backend rejects it cleanly
- Try creating topic material with too little text and confirm validation is clear
- Try submitting a quiz with unanswered questions and confirm it still saves with zero scores where appropriate

## Persistence

- Refresh on `/dashboard` and confirm data reloads correctly
- Refresh on `/history` and confirm data reloads correctly
- Refresh on `/results/:attemptId` and confirm question review still appears from persisted data
- Log out and log back in to confirm old materials, quizzes, and attempts remain available

## Error Handling

- Stop the server and confirm the client shows useful load errors
- Trigger a failed quiz-generation request and confirm the UI shows a clear message
- Trigger an expired-session request and confirm the app returns to login cleanly

## UX

- Check that no page exposes raw endpoint names or backend implementation language
- Check that button labels are clear and consistent
- Check that empty states explain what to do next
- Check that loading states appear during uploads, generation, and data fetches
