# JIVAN DAAN - Blood Donation Platform

## Overview

A premium, modern blood donation platform built by INCLUDER TECHNOLOGIES (Rakshit Awasthi, Ajay Singh Chauhan, Shubham Yadav). Connects blood donors with those in urgent need.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Features

- Auth system (login/register) with role-based routing: Donor, Receiver, Hospital
- Home page with hero, live stats, emergency banner, smart search by PIN code, features, testimonials, about section
- Find Donor page with blood group filtering
- Request Blood page with urgency levels (Critical/Urgent/Normal)
- Donate page with eligibility info
- Profile & Edit Profile pages
- Hospital Dashboard (role-restricted)
- Floating AI health chatbot with local Q&A
- Footer: "Powered by INCLUDER TECHNOLOGIES"

## Structure

```text
artifacts/
├── api-server/         # Express API server
│   └── src/routes/    # users, donors, requests, hospitals, stats
└── jivan-daan/         # React + Vite frontend (served at /)
lib/
├── api-spec/           # OpenAPI spec + Orval codegen config
├── api-client-react/   # Generated React Query hooks
├── api-zod/            # Generated Zod schemas
└── db/                 # Drizzle ORM schema + DB connection
    └── src/schema/    # users, requests, hospitals tables
```

## Database Schema

- `users` — uid, name, email, role (donor/receiver/hospital), bloodGroup, location, pinCode, image, hospitalName, contact, isAvailable
- `blood_requests` — bloodGroup, location, urgency, patientName, units, contactNumber, description, createdBy, status
- `hospitals` — uid, name, location, contact, email

## API Routes

- `GET /api/healthz` — health check
- `POST /api/users` — create/upsert user
- `GET /api/users/:uid` — get user
- `PUT /api/users/:uid` — update user
- `GET /api/donors` — list donors (filter: bloodGroup, pinCode)
- `GET /api/requests` — list blood requests (filter: bloodGroup, urgency)
- `POST /api/requests` — create blood request
- `DELETE /api/requests/:id` — delete request
- `GET /api/hospitals` — list hospitals
- `POST /api/hospitals` — register hospital
- `GET /api/stats` — platform statistics

## Running

- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm --filter @workspace/jivan-daan run dev` — Frontend
- `pnpm --filter @workspace/db run push` — Push DB schema changes
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client
