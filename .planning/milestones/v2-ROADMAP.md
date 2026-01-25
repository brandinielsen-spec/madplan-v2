# Milestone v2.0: Complete Rebuild

**Status:** SHIPPED 2026-01-25
**Phases:** 1-5
**Total Plans:** 20

## Overview

Complete rebuild of Madplan app with modern tech stack (Next.js 16 + Tailwind v4 + shadcn/ui). Added smart import from URLs and images, plus recipe organization with favorites, tags, and filtering. Native PWA experience with swipe gestures and offline support.

**Core Value:** Ubesvaeret madplanlaegning med smarte opskrifter

## Phases

### Phase 1: Foundation

**Goal**: Moderne app shell med PWA kapabilitet
**Depends on**: None
**Plans**: 2 plans

Plans:
- [x] 01-01: Project setup with Tailwind v4 + shadcn/ui + earth tone theme
- [x] 01-02: PWA manifest, layout components, placeholder pages

**Requirements:**
- UIX-01: Moderne UI med shadcn/ui komponenter
- UIX-02: PWA — installerbar pa mobil som app
- UIX-05: Mobil-first responsivt design

**Deliverables:**
- Next.js projekt med TypeScript
- Tailwind v4 + shadcn/ui konfigureret
- PWA manifest med ikoner
- Basis layout med mobile navigation
- Placeholder sider for alle routes

---

### Phase 2: Core Data Flow

**Goal**: Brugere kan tilga v1 funktionalitet gennem ny UI
**Depends on**: Phase 1
**Plans**: 6 plans

Plans:
- [x] 02-01: Data foundation: SWR, types, date-fns, shadcn components
- [x] 02-02: API routes proxying to n8n webhooks
- [x] 02-03: SWR data hooks with optimistic updates
- [x] 02-04: Ugeplan view with week navigation and meal management
- [x] 02-05: Indkobsliste view with checkbox toggle
- [x] 02-06: Opskrifter view with cards/list toggle

**Requirements:**
- UIX-03: Hurtig navigation uden page reloads

**Deliverables:**
- API routes som proxy til v1 n8n workflows
- Ugeplan view med data fra backend
- Indkobsliste view med afkrydsning
- Opskrifter liste view
- Client-side navigation (Next.js App Router)

---

### Phase 3: PWA Enhancement

**Goal**: App foeles native med gestures og caching
**Depends on**: Phase 2
**Plans**: 3 plans

Plans:
- [x] 03-01: Swipe gesture infrastructure (Embla Carousel, hooks, components)
- [x] 03-02: Integrate swipe into Ugeplan page with week carousel
- [x] 03-03: Service worker caching and offline support

**Requirements:**
- UIX-04: Swipe gestures til navigation mellem uger

**Deliverables:**
- Swipe gesture handling (Embla Carousel)
- Uge-navigation med swipe
- Service worker med caching strategies
- Offline banner og SWR cache persistence

---

### Phase 4: Smart Import

**Goal**: Brugere kan importere opskrifter fra URLer og billeder
**Depends on**: Phase 2
**Plans**: 5 plans

Plans:
- [x] 04-01: Foundation: types, form libs, API routes
- [x] 04-02: Recipe form component with validation
- [x] 04-03: URL import form with loading/error states
- [x] 04-04: Image import with camera/gallery and URL detection
- [x] 04-05: Tilfoej page integration (wires all components)

**Requirements:**
- IMP-01: Import opskrift fra URL med auto-udtraekning
- IMP-02: Import opskrift fra billede med OCR
- IMP-03: Detect URL i billede og hent derfra i stedet
- IMP-04: Gem opskriftsbillede hvis tilgaengeligt fra URL
- IMP-05: Preview importeret opskrift for gem
- IMP-06: Rediger importeret data for gem
- N8N-01: Alle workflows versioneres med inkrementelt nummer

**Deliverables:**
- Import UI (URL input + kamera/upload)
- n8n workflow: URL import med JSON-LD parsing (ver 1)
- n8n workflow: Billede OCR med URL detection (ver 1)
- Preview/edit modal for gem
- Airtable felter: BilledeUrl, Kilde

---

### Phase 5: Organization

**Goal**: Brugere kan organisere og finde opskrifter nemt
**Depends on**: Phase 4
**Plans**: 4 plans

Plans:
- [x] 05-01: Foundation: types extension, API routes, CSS animation, Popover
- [x] 05-02: Favorite feature: FavoriteButton, hook extension, integration
- [x] 05-03: Tag management: TagChip, TagInput, detail page editing
- [x] 05-04: Filter bar: FilterBar, EmptyState, Opskrifter page filtering

**Requirements:**
- ORG-01: Favorit-markering pa opskrifter
- ORG-02: Tags pa opskrifter (bruger-definerede)
- ORG-03: Soeg i opskrifter (titel)
- ORG-04: Filter opskrifter pa tags
- ORG-05: Filter opskrifter pa favoritter

**Deliverables:**
- Favorit toggle pa opskrift cards og detalje-view
- Tag management UI (tilfoej/fjern tags)
- Soegefelt med live-filtrering
- Tag filter chips
- Favorit filter toggle
- Airtable felter: Favorit, Tags
- n8n workflows opdateret til at handtere nye felter

---

## Milestone Summary

**Key Decisions:**
- Ny kodebase i stedet for refaktor (Rationale: Renere arkitektur) — Outcome: Good
- shadcn/ui som komponent-bibliotek (Rationale: Moderne, tilpasseligt) — Outcome: Good
- Behold Airtable (Rationale: Fungerer, nemt at inspicere) — Outcome: Good
- Embla Carousel for swipe (Rationale: Lightweight, no touch-action conflicts) — Outcome: Good
- Tailwind v4 with @theme inline (Rationale: Modern syntax) — Outcome: Good

**Issues Resolved:**
- touch-action CSS was blocking swipe gestures (fixed by removing touch-action: none)
- n8n webhook paths needed POST method for delete operations
- Service worker registration timing needed client-side component

**Tech Debt Incurred:**
- ejerId uses first ejer workaround (TODO: implement user context when multi-user needed)
- Service worker prefetch listener exists but not called (enhancement opportunity)

---

*Archived: 2026-01-25 as part of v2.0 milestone completion*
*For current project status, see .planning/ROADMAP.md (if exists) or .planning/PROJECT.md*
