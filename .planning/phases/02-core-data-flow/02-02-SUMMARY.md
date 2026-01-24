---
phase: 02-core-data-flow
plan: 02
subsystem: api
tags: [next.js, api-routes, n8n, proxy, server-side]

# Dependency graph
requires:
  - phase: 02-01
    provides: TypeScript types for API responses
provides:
  - API route proxies for ejere, uge, dag, opskrifter, indkob
  - Server-side n8n URL hiding (no client exposure)
  - Consistent error handling pattern
affects: [02-03, 02-04, 02-05, 02-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js App Router API routes with NextResponse"
    - "Server-side env var (N8N_WEBHOOK_URL) for n8n proxy"
    - "Upstream error forwarding with status codes"

key-files:
  created:
    - madplan-v2/.env.local.example
    - madplan-v2/src/app/api/madplan/ejere/route.ts
    - madplan-v2/src/app/api/madplan/uge/route.ts
    - madplan-v2/src/app/api/madplan/dag/route.ts
    - madplan-v2/src/app/api/madplan/opskrifter/route.ts
    - madplan-v2/src/app/api/madplan/indkob/route.ts
  modified: []

key-decisions:
  - "Server-only N8N_WEBHOOK_URL (no NEXT_PUBLIC_ prefix)"
  - "result.data ?? result pattern for n8n response normalization"
  - "cache: no-store for all GET requests to n8n"
  - "POST /api/madplan/dag with action field to route update vs delete"

patterns-established:
  - "API proxy pattern: check env -> validate params -> fetch n8n -> normalize response"
  - "Error responses: { error: string } with appropriate HTTP status"

# Metrics
duration: 15min
completed: 2026-01-24
---

# Phase 02 Plan 02: API Routes Summary

**5 Next.js API route proxies hiding n8n webhook URLs server-side with consistent error handling**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-24T14:45:00Z
- **Completed:** 2026-01-24T15:00:00Z
- **Tasks:** 3
- **Files created:** 6

## Accomplishments
- Created .env.local.example documenting N8N_WEBHOOK_URL requirement
- Built 5 API route handlers proxying to n8n webhooks
- n8n URL is server-only (not in client bundle)
- User configured .env.local and verified API connectivity

## Task Commits

Each task was committed atomically:

1. **Task 1: Create .env.local template and API route directory structure** - `e602f9c` (feat)
2. **Task 2: Create API route handlers** - `e602f9c` (feat) - combined with Task 1
3. **Task 3: Configure N8N_WEBHOOK_URL** - User action (no commit, .env.local is gitignored)

**Plan metadata:** pending (this commit)

## Files Created/Modified

- `.env.local.example` - Documents required N8N_WEBHOOK_URL env var
- `src/app/api/madplan/ejere/route.ts` - GET /api/madplan/ejere proxy
- `src/app/api/madplan/uge/route.ts` - GET /api/madplan/uge?ejerId&aar&uge proxy
- `src/app/api/madplan/dag/route.ts` - POST /api/madplan/dag proxy (update/delete via action)
- `src/app/api/madplan/opskrifter/route.ts` - GET /api/madplan/opskrifter?ejerId proxy
- `src/app/api/madplan/indkob/route.ts` - GET/POST/PUT /api/madplan/indkob proxy

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Server-only env var | N8N_WEBHOOK_URL without NEXT_PUBLIC_ keeps n8n URL out of client bundle |
| result.data ?? result | n8n responses may wrap data in .data property, normalize for client |
| cache: no-store | Always fetch fresh data from n8n, no Next.js caching |
| Single dag endpoint | POST with action field routes to /dag/opdater or /dag/slet |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

**External services require manual configuration.**

User completed:
1. Copied .env.local.example to .env.local
2. Set N8N_WEBHOOK_URL to their n8n webhook base URL
3. Restarted dev server
4. Verified API returns data

Environment variable:
- `N8N_WEBHOOK_URL` - Base URL for n8n webhooks (e.g., https://your-instance.app.n8n.cloud/webhook)

## Next Phase Readiness

- API routes ready for consumption by SWR hooks (Plan 02-03 already complete)
- All 5 endpoints functional: ejere, uge, dag, opskrifter, indkob
- Ready to build UI pages (Plans 02-04, 02-05, 02-06)

---
*Phase: 02-core-data-flow*
*Completed: 2026-01-24*
