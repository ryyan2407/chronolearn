# ChronoLearn

ChronoLearn is a full-stack history learning app with:

- a Node.js + Express + Prisma API in `server/`
- a React + Vite client in `client/`
- PostgreSQL for persistence

This README covers the fastest way to get the app running locally.

## Prerequisites

Install these first:

- Node.js 20+
- npm 10+
- PostgreSQL 15+

If you need OS-specific install steps, see [setup.md](/home/ryyan/chronolearn/setup.md).

## Project Structure

```txt
chronolearn/
├── client/   # React + Vite frontend
├── server/   # Express + Prisma backend
└── docs/     # API notes
```

## 1. Create the Database

Create a local PostgreSQL database named `chronolearn`.

Example:

```bash
createdb chronolearn
```

If `createdb` is not available, open `psql` and run:

```sql
CREATE DATABASE chronolearn;
```

## 2. Set Up the Server

Open a terminal in the server directory:

```bash
cd /home/ryyan/chronolearn/server
```

Create the env file:

```bash
cp .env.example .env
```

Update `server/.env` if needed. The main value you must set is `DATABASE_URL`.

Example local config:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chronolearn?schema=public"
SESSION_SECRET=replace-this-with-a-long-random-string-at-least-32-characters
GROQ_API_KEY=
GROQ_API_KEYS=
GROQ_MODEL=llama-3.3-70b-versatile
CORS_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The API runs on:

```txt
http://localhost:4000
```

Health check:

```txt
http://localhost:4000/health
```

## 3. Set Up the Client

Open a second terminal:

```bash
cd /home/ryyan/chronolearn/client
```

Create the client env file:

```bash
cp .env.example .env
```

The default client config is:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The client usually runs on:

```txt
http://localhost:5173
```

## 4. Open the App

With both processes running:

1. Open `http://localhost:5173`
2. Confirm the client can reach the API at `http://localhost:4000/api`
3. Create material from a topic or PDF upload
4. Generate a quiz and complete an attempt

## Useful Commands

Server:

```bash
cd /home/ryyan/chronolearn/server
npm run dev
npm run build
npm run lint
```

Client:

```bash
cd /home/ryyan/chronolearn/client
npm run dev
npm run build
```

## Notes

- The frontend and backend run separately and both must be started for the app to work.
- The backend requires PostgreSQL. The client does not.
- If no Groq API key is configured, parts of quiz generation and short-answer evaluation may fall back to deterministic local logic where supported by the backend.
- CORS is configured for `http://localhost:5173` by default.

## Troubleshooting

`DATABASE_URL is required`

- Check that `server/.env` exists and contains a valid `DATABASE_URL`.

`Prisma can't connect to the database`

- Make sure PostgreSQL is running.
- Make sure the `chronolearn` database exists.
- Verify the username, password, host, and port in `DATABASE_URL`.

`The client loads but API requests fail`

- Make sure the server is running on port `4000`.
- Check that `client/.env` points to `http://localhost:4000/api`.
- Check that `CORS_ORIGINS` in `server/.env` includes `http://localhost:5173`.

`Port already in use`

- Change `PORT` in `server/.env`, or stop the process already using port `4000`.
- If you change the backend port, also update `VITE_API_BASE_URL` in `client/.env`.
