---
name: adzu-sdu
description: Work on the ADZU Social Development Unit platform (backend + frontend monorepo on Supabase Postgres, live on Vercel). Use when changing programs, approvals, the unit director or office dashboards, or the local demo setup.
---

# ADZU SDU

- Read `AGENTS.md`, then `LOCAL_SETUP.md` for the local Supabase and seed steps.
- Run: `npm run install:all`, start local Supabase, `npm run db:local:reset`, `npm run dev`.
- Feature notes: `PROGRAM_REQUEST_IMPLEMENTATION.md`, `PROGRAM_EDIT_DELETE_APPROVAL.md`, `PROGRAM_MANAGEMENT_CONSOLIDATION.md`, `UNIT_DIRECTOR_PROGRAM_TABS.md`, `aces_dashboard_data_flow.md`. Open the one for the feature.
- Verify: `npm run build`. No root test script exists.
- RULE: never run against production data.
