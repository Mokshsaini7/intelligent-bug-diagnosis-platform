# BugDiag Frontend

React + TypeScript frontend for the Intelligent Bug Diagnosis Platform.

## Requirements

- Node.js 20+
- npm 10+
- FastAPI backend available at `http://localhost:8000` (or configure the API URL)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Environment

`VITE_API_BASE_URL` must point to the backend API prefix, normally `http://localhost:8000/api/v1`.
Only public browser configuration belongs in `VITE_` variables. Never place secrets there.

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Backend contract

The frontend expects:

- `GET /submissions?page=1&page_size=10&search=&severity=&status=`
- `POST /submissions`
- `GET /submissions/{id}`
- `GET /health`
- `GET /ready`

The submissions list adapter accepts either `{ data, pagination }`, `{ items, pagination }`,
or a direct array. If your backend response differs, update `src/services/submissionService.ts`.

The health endpoints are expected at the backend root, outside `/api/v1`.
