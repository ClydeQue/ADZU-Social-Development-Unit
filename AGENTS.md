# ADZU Social Development Unit

## ClydeOS context

- Inside ClydeOS, read [the root router](../../../AGENTS.md).
    - Shared project contract: [projects/AGENTS.md](../../AGENTS.md).
    - Project pointer: [ADZU-SDU.md](../../notes/ADZU-SDU.md).
- A standalone clone uses this file and its available setup documents.
    - `CLAUDE.md` imports only `AGENTS.md`.
    - Inspect existing local changes before editing this checkout.
    - A missing local-only setup note is not authorization to use production data.

Monorepo for the Ateneo de Zamboanga SDU platform. Backend and frontend, Supabase Postgres.

- Repo: `ClydeQue/ADZU-Social-Development-Unit`, branch `main`.
- Live site: `ateneo-sdu.vercel.app`. It holds real data.
- Layout: `backend/`, `frontend/`, `supabase/`, `scripts/`, design notes as root `.md` files.

## Commands

- `npm run install:all`: root, backend and frontend dependencies
- `npm run dev`: backend and frontend together
- `npm run build`: frontend build
- `npm run db:local:reset`: loads `backend/db/schema.sql` and `seed.sql` into local Postgres on 54322
- Local database setup: `LOCAL_SETUP.md` when that local note is present.
- `npm --prefix backend test`: isolated authentication checks.
    - These checks never connect to a database.
- Set `JWT_ACCESS_SECRET` and a different `JWT_REFRESH_SECRET` before startup.
    - Generate each value with `node -p "require('node:crypto').randomBytes(32).toString('hex')"` in your own terminal.
    - Keep both values in the selected environment's private configuration.
    - Missing signing keys stop startup.

## Rules

- RULE: develop and demo on the local database only. Never point a local run at the live site's data.
- Seeded demo logins are listed in `LOCAL_SETUP.md`. Do not copy them into other docs.
- Program flow notes live in the root `.md` files. Read the one that matches the feature first.
