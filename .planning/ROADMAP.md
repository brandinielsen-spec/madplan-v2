# Roadmap: Madplan v2

**Created:** 2025-01-24
**Depth:** Standard (5-8 phases)
**Mode:** YOLO + Parallel

## Overview

| Phase | Name | Goal | Requirements |
|-------|------|------|--------------|
| 1 | Foundation | Modern app shell med PWA | UIX-01, UIX-02, UIX-05 |
| 2 | Core Data Flow | V1 funktionalitet i ny UI | UIX-03 |
| 3 | PWA Enhancement | Native app-folelse med gestures | UIX-04 |
| 4 | Smart Import | Import opskrifter fra URL og billeder | IMP-01 til IMP-06, N8N-01 |
| 5 | Organization | Organiser og find opskrifter | ORG-01 til ORG-05 |

**Total:** 5 phases | 17 requirements | 100% coverage

## Dependencies

```
Phase 1 (Foundation)
    |
    v
Phase 2 (Core Data Flow)
    |
    +---> Phase 3 (PWA Enhancement)  --+
    |                                  +--> Can run in parallel
    +---> Phase 4 (Smart Import)     --+
              |
              v
         Phase 5 (Organization)
```

---

## Phase 1: Foundation

**Goal:** Moderne app shell med PWA kapabilitet

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Project setup with Tailwind v4 + shadcn/ui + earth tone theme
- [x] 01-02-PLAN.md — PWA manifest, layout components, placeholder pages

**Completed:** 2026-01-24

**Requirements:**
- UIX-01: Moderne UI med shadcn/ui komponenter
- UIX-02: PWA — installerbar pa mobil som app
- UIX-05: Mobil-first responsivt design

**Success Criteria:**
1. Bruger kan abne app og se moderne UI med shadcn/ui styling
2. Bruger kan installere app pa mobil via "Add to Home Screen"
3. App viser korrekt pa bade mobil og desktop
4. PWA manifest er valid og ikoner vises korrekt

**Deliverables:**
- Next.js projekt med TypeScript
- Tailwind v4 + shadcn/ui konfigureret
- PWA manifest med ikoner
- Basis layout med mobile navigation
- Placeholder sider for alle routes

---

## Phase 2: Core Data Flow

**Goal:** Brugere kan tilga v1 funktionalitet gennem ny UI

**Plans:** 6 plans

Plans:
- [x] 02-01-PLAN.md — Data foundation: SWR, types, date-fns, shadcn components
- [x] 02-02-PLAN.md — API routes proxying to n8n webhooks
- [x] 02-03-PLAN.md — SWR data hooks with optimistic updates
- [x] 02-04-PLAN.md — Ugeplan view with week navigation and meal management
- [x] 02-05-PLAN.md — Indkobsliste view with checkbox toggle
- [x] 02-06-PLAN.md — Opskrifter view with cards/list toggle

**Completed:** 2026-01-24

**Requirements:**
- UIX-03: Hurtig navigation uden page reloads

**Success Criteria:**
1. Bruger kan se ugeplan med retter for aktuel uge
2. Bruger kan navigere mellem uger
3. Bruger kan tilfoeje/redigere/slette ret pa dag
4. Bruger kan se og afkrydse indkobsliste
5. Navigation mellem sider sker uden fuld page reload

**Deliverables:**
- API routes som proxy til v1 n8n workflows
- Ugeplan view med data fra backend
- Indkobsliste view med afkrydsning
- Opskrifter liste view
- Client-side navigation (Next.js App Router)

---

## Phase 3: PWA Enhancement

**Goal:** App foeles native med gestures og caching

**Plans:** 3 plans

Plans:
- [x] 03-01-PLAN.md — Swipe gesture infrastructure (Embla Carousel, hooks, components)
- [x] 03-02-PLAN.md — Integrate swipe into Ugeplan page with week carousel
- [x] 03-03-PLAN.md — Service worker caching and offline support

**Completed:** 2026-01-24

**Requirements:**
- UIX-04: Swipe gestures til navigation mellem uger

**Success Criteria:**
1. Bruger kan swipe venstre/hojre for at skifte uge
2. Swipe virker smooth uden at trigge browser back
3. Visuel feedback under swipe (animation)

**Deliverables:**
- Swipe gesture handling (Embla Carousel)
- Uge-navigation med swipe
- Service worker med caching strategies
- Offline banner og SWR cache persistence

---

## Phase 4: Smart Import

**Goal:** Brugere kan importere opskrifter fra URL'er og billeder

**Plans:** 5 plans

Plans:
- [x] 04-01-PLAN.md — Foundation: types, form libs, API routes
- [x] 04-02-PLAN.md — Recipe form component with validation
- [x] 04-03-PLAN.md — URL import form with loading/error states
- [x] 04-04-PLAN.md — Image import with camera/gallery and URL detection
- [x] 04-05-PLAN.md — Tilfoej page integration (wires all components)

**Completed:** 2026-01-25

**Requirements:**
- IMP-01: Import opskrift fra URL med auto-udtraekning
- IMP-02: Import opskrift fra billede med OCR
- IMP-03: Detect URL i billede og hent derfra i stedet
- IMP-04: Gem opskriftsbillede hvis tilgaengeligt fra URL
- IMP-05: Preview importeret opskrift for gem
- IMP-06: Rediger importeret data for gem
- N8N-01: Alle workflows versioneres med inkrementelt nummer

**Success Criteria:**
1. Bruger kan indsaette URL og fa opskrift udtrukket automatisk
2. Bruger kan tage/uploade billede og fa tekst udtrukket via OCR
3. Hvis billede indeholder URL, hentes opskrift derfra automatisk
4. Opskriftsbillede gemmes hvis tilgaengeligt
5. Bruger ser preview og kan redigere for gem

**Deliverables:**
- Import UI (URL input + kamera/upload)
- n8n workflow: URL import med JSON-LD parsing (ver 1)
- n8n workflow: Billede OCR med URL detection (ver 1)
- Preview/edit modal for gem
- Airtable felter: BilledeUrl, Kilde

---

## Phase 5: Organization

**Goal:** Brugere kan organisere og finde opskrifter nemt

**Requirements:**
- ORG-01: Favorit-markering pa opskrifter
- ORG-02: Tags pa opskrifter (bruger-definerede)
- ORG-03: Soeg i opskrifter (titel)
- ORG-04: Filter opskrifter pa tags
- ORG-05: Filter opskrifter pa favoritter

**Success Criteria:**
1. Bruger kan markere opskrift som favorit (hjerte-ikon)
2. Bruger kan tilfoeje/fjerne tags pa opskrift
3. Bruger kan soege i opskrifter og se resultater live
4. Bruger kan filtrere liste pa valgte tags
5. Bruger kan vise kun favoritter

**Deliverables:**
- Favorit toggle pa opskrift cards og detalje-view
- Tag management UI (tilfoej/fjern tags)
- Soegefelt med live-filtrering
- Tag filter chips
- Favorit filter toggle
- Airtable felter: Favorit, Tags
- n8n workflows opdateret til at handtere nye felter

---

## Airtable Schema Changes

| Tabel | Felt | Type | Phase |
|-------|------|------|-------|
| Opskrifter | Favorit | Checkbox | 5 |
| Opskrifter | Tags | Multi-select | 5 |
| Opskrifter | BilledeUrl | URL | 4 |
| Opskrifter | Kilde | Single line text | 4 |

---

## n8n Workflow Versions

| Workflow | Initial | Notes |
|----------|---------|-------|
| Madplan - Import URL | 1 | Ny i Phase 4 |
| Madplan - Import Billede | 1 | Opdateret med URL detection i Phase 4 |
| Madplan - Hent Opskrifter | 1 | Opdateret med nye felter i Phase 5 |
| Madplan - Opdater Opskrift | 1 | Opdateret med favorit/tags i Phase 5 |

---

*Roadmap created: 2025-01-24*
