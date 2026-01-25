# Madplan App v2

## What This Is

En moderne madplanlaegnings-app der goer det nemt at planlaegge ugens maltider, importere opskrifter smart fra billeder og URLer, og holde styr pa indkob. Bygget som PWA med app-lignende oplevelse til familie og venner.

**Current State:** v2.0 shipped with 69 TypeScript files, ~60k LOC. Full PWA with swipe gestures, smart import, and recipe organization.

## Core Value

**Ubesvaeret madplanlaegning med smarte opskrifter.** Brugeren skal kunne ga fra "jeg fandt en opskrift" til "den er i min ugeplan" med minimal friktion.

## Requirements

### Validated

<!-- v2 requirements — all shipped 2026-01-25 -->

**UI/UX:**
- ✓ Moderne UI med shadcn/ui komponenter — v2.0
- ✓ PWA (installerbar pa mobil) — v2.0
- ✓ Swipe gestures til navigation mellem uger — v2.0
- ✓ Hurtig navigation uden page reloads — v2.0
- ✓ Mobil-first responsivt design — v2.0

**Smart Import:**
- ✓ Import opskrift fra URL med fuld udtraekning — v2.0
- ✓ Import opskrift fra billede (OCR) — v2.0
- ✓ Detect URL pa billede og hent derfra i stedet — v2.0
- ✓ Gem opskriftsbillede hvis tilgaengeligt — v2.0

**Organisering:**
- ✓ Favorit-markering pa opskrifter — v2.0
- ✓ Tags/kategorier pa opskrifter — v2.0
- ✓ Soeg og filtrer opskrifter — v2.0

**n8n:**
- ✓ Alle workflows tagget med version — v2.0

<!-- Arvet fra v1 — dette virker allerede -->

- ✓ Ugeplan med mandag-sondag visning — v1
- ✓ Navigation mellem uger (ISO-ugenummer) — v1
- ✓ Tilfoej/rediger/slet retter pa dage — v1
- ✓ Opskrifter med titel, portioner, ingredienser, fremgangsmade — v1
- ✓ Genbrug af opskrifter pa tvaers af uger — v1
- ✓ Auto-genereret indkobsliste fra ugens retter — v1
- ✓ Manuelle indkobsposter — v1
- ✓ Afkrydsning af indkobsposter — v1
- ✓ Kopier uge funktionalitet — v1
- ✓ Ejer-koncept (kontekst-switching) — v1

### Active

<!-- v2.1 scope — next milestone -->

(No active requirements — start next milestone with /gsd:new-milestone)

### Out of Scope

- Drag & drop pa ugeplan — v2.1, UI-kompleksitet
- Smart indkobsliste (kategorier, sammenlaegning) — v2.1
- Del indkobsliste — v2.1
- AI-madforslag — v2.1, kraever mere research
- Saeson-ingredienser — v2.1
- Portionsjustering per dag — v2.1
- Login og brugerkonti — holder det simpelt
- Multi-bruger sync — ejer-koncept er nok
- Kalorier/ernaering — ikke relevant for use case
- Supermarked-integration — for komplekst

## Context

**Baseret pa v1:**
- v1 er en fungerende app med Next.js + Airtable + n8n
- v1 kode ligger i `../Madplan/madplan/`
- v1 n8n workflows ligger i `../Madplan/n8n-workflows/`
- v2 er en ny kodebase, men genbruger Airtable struktur og n8n patterns

**v2 Tech Stack:**
- Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui
- SWR for data fetching with optimistic updates
- Embla Carousel for swipe gestures
- Service worker for offline support
- react-hook-form + zod for form validation

**Brugere:**
- Familie og venner (ikke offentlig)
- Dansk som primaert sprog

## Constraints

- **Database**: Airtable — beholdes fra v1, fungerer godt
- **Backend**: n8n workflows — beholdes, alle nye workflows tagges ver2
- **Frontend**: Next.js + TypeScript + shadcn/ui — ny kodebase
- **Sprog**: Dansk UI, dansk i kode-kommentarer er OK
- **Platform**: Web med PWA, mobil-first

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ny kodebase i stedet for refaktor | Renere arkitektur, moderne patterns fra start | ✓ Good — clean codebase, modern patterns |
| shadcn/ui som komponent-bibliotek | Moderne, tilpasseligt, god mobil-support | ✓ Good — consistent UI, easy customization |
| Behold Airtable | Fungerer, nemt at inspicere data, ingen migration | ✓ Good — no migration needed |
| Kernen forst (v2), resten senere (v2.1) | Grundigt arbejde frem for feature creep | ✓ Good — shipped complete v2 |
| Embla Carousel for swipe | Lightweight, no touch-action conflicts | ✓ Good — smooth native feel |
| Tailwind v4 with @theme inline | Modern syntax, OKLCH colors | ✓ Good — beautiful earth tone theme |
| SWR with optimistic updates | Fast UI, good UX | ✓ Good — instant feedback |
| Service worker network-first | Fresh data when online, cached when offline | ✓ Good — works offline |

## Tech Debt

- ejerId uses first ejer workaround (TODO: implement user context when multi-user needed)
- Service worker prefetch listener exists but not called (enhancement opportunity)

---
*Last updated: 2026-01-25 after v2.0 milestone*
