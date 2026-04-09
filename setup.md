# ChronoLearn Setup

This project uses:

- Node.js 20+
- npm 10+
- PostgreSQL 15+

The application dependencies are installed from [server/package.json](/home/ryyan/chronolearn/server/package.json), not from `requirements.txt`.

## 1. Windows

### Install Node.js and npm

Download and install Node.js LTS from:

- https://nodejs.org/

After install, verify:

```powershell
node -v
npm -v
```

### Install PostgreSQL

Download PostgreSQL from:

- https://www.postgresql.org/download/windows/

During setup:

- remember the `postgres` password you choose
- keep the default port `5432` unless you have a reason to change it

Verify PostgreSQL from PowerShell if `psql` is available:

```powershell
psql --version
```

### Create the database

Open `SQL Shell (psql)` or use PowerShell:

```powershell
psql -U postgres
```

Then run:

```sql
CREATE DATABASE chronolearn;
```

### Install project dependencies

```powershell
cd C:\path\to\chronolearn\server
copy .env.example .env
npm install
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/chronolearn?schema=public"
GROQ_API_KEY=
GROQ_API_KEYS=
```

### Initialize Prisma and run the server

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 2. macOS

### Install Homebrew

If you do not have Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Node.js and PostgreSQL

```bash
brew install node
brew install postgresql@15
```

Start PostgreSQL:

```bash
brew services start postgresql@15
```

Verify:

```bash
node -v
npm -v
psql --version
```

### Create the database

```bash
createdb chronolearn
```

If that fails, try:

```bash
psql postgres
```

Then run:

```sql
CREATE DATABASE chronolearn;
```

### Install project dependencies

```bash
cd /path/to/chronolearn/server
cp .env.example .env
npm install
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/chronolearn?schema=public"
GROQ_API_KEY=
GROQ_API_KEYS=
```

If your local PostgreSQL user is your macOS username, use that instead of `postgres`.

### Initialize Prisma and run the server

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 3. Ubuntu / Debian

### Install Node.js 20 and PostgreSQL 15

Install Node.js 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install PostgreSQL:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

Start PostgreSQL:

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Verify:

```bash
node -v
npm -v
psql --version
```

### Create the database

```bash
sudo -u postgres psql
```

Then run:

```sql
CREATE DATABASE chronolearn;
ALTER USER postgres WITH PASSWORD 'postgres';
```

Exit with:

```sql
\q
```

### Install project dependencies

```bash
cd /path/to/chronolearn/server
cp .env.example .env
npm install
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chronolearn?schema=public"
GROQ_API_KEY=
GROQ_API_KEYS=
```

### Initialize Prisma and run the server

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 4. Optional Groq Setup

If you want AI-powered quiz generation and short-answer grading, set this in `.env`:

```env
GROQ_API_KEY=your_primary_groq_key_here
GROQ_API_KEYS=your_primary_groq_key_here,your_secondary_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Use either `GROQ_API_KEY` for one key or `GROQ_API_KEYS` for a comma-separated pool of keys. If both are set, all keys are used.

If no Groq key is set, the app still works with fallback quiz generation and fallback short-answer scoring.

## 5. Common Commands

From `/home/ryyan/chronolearn/server`:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 6. Troubleshooting

### `npx prisma migrate dev` fails with database auth errors

Check the username, password, port, and database name in `.env`.

### `npm install` fails

Confirm `node -v` is 20 or newer and `npm -v` is available.

### `pdf-parse` or Prisma install issues

Delete `node_modules` and retry:

```bash
rm -rf node_modules package-lock.json
npm install
```

On Windows, delete those items manually in File Explorer or PowerShell.

### Groq calls fail

Check that `GROQ_API_KEY` or `GROQ_API_KEYS` is set correctly. If both are blank, the app intentionally falls back to local logic.
