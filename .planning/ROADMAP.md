# Roadmap: Madplan v2.1 Bug Fixes & Polish

**Created:** 2026-01-26
**Milestone:** v2.1
**Phases:** 6-8 (continuing from v2.0)

## Overview

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 6 | Foundation & Polish | 3 | ✓ Complete |
| 7 | Opskrifter Enhancement | 4 | Planned |
| 8 | Madplan Enhancement | 4 | Pending |

**Total:** 11 requirements across 3 phases

---

## Phase 6: Foundation & Polish

**Goal:** Fix base-level issues that affect the entire app

**Requirements:**
- BUG-06: Danske tegn vises korrekt i UI (oe -> oe, ae -> ae, aa -> aa)
- UI-02: Bundmenu viser 5 ikoner: Hjem, Ugeplan, Opskrifter, Tilfoej, Indkoeb
- BUG-05: Indkobsliste viser korrekt kilde (opskrift-navn eller "Tilfojet manuelt")

**Success Criteria:**
1. Alle UI-tekster bruger korrekte danske tegn
2. Bundmenu har 5 ikoner med Hjem foerst
3. Indkobsliste-items fra madplan viser opskrift-navn som kilde

**Dependencies:** None (foundation work)

**Plans:** 2 plans

Plans:
- [x] 06-01-PLAN.md - Danish characters + Home navigation icon
- [x] 06-02-PLAN.md - Shopping list source display

**Completed:** 2026-01-26

---

## Phase 7: Opskrifter Enhancement

**Goal:** Complete the organization features that were supposed to ship in v2.0

**Requirements:**
- BUG-01: Favoritter gemmes til Airtable naar bruger toggler
- BUG-02: Tags kan tilfojes, redigeres og vises paa opskrifter
- BUG-03: Bruger kan filtrere opskrifter efter tags
- FEAT-03: Bruger kan tilfoeje opskrifts ingredienser til indkobsliste med et klik

**Success Criteria:**
1. Favorit-toggle persists efter page refresh
2. Bruger kan tilfoeje og se tags paa opskrifter
3. Opskrift-filter inkluderer tag-filter
4. "Tilfoej til indkobsliste" knap paa opskrift tilfojer alle ingredienser

**Dependencies:** Phase 6 (danske tegn affects labels)

**Plans:** 3 plans

Plans:
- [ ] 07-01-PLAN.md - N8N backend for favorites/tags persistence (BUG-01, BUG-02)
- [ ] 07-02-PLAN.md - Tag filter verification (BUG-03)
- [ ] 07-03-PLAN.md - Add to shopping list button (FEAT-03)

---

## Phase 8: Madplan Enhancement

**Goal:** Improve the weekly meal plan experience

**Requirements:**
- BUG-04: Bruger kan tilfoeje ret til madplan for alle uger (ikke kun aktuel)
- FEAT-01: Bruger kan tilfoeje kort note til ret paa madplan
- FEAT-02: Note vises under opskrift-titel paa ugeplan
- UI-01: Madplan har liste/grid view toggle

**Success Criteria:**
1. "Tilfoej til madplan" dialog tillader valg af fremtidige uger
2. Ret-kort paa ugeplan har note-felt
3. Noter (fx "Rest", "Fra frost") vises under opskrift-titel
4. View toggle skifter mellem liste og grid layout

**Dependencies:** Phase 6 (foundation), Phase 7 (opskrift changes)

---

## Requirement Coverage

| Requirement | Phase | Description |
|-------------|-------|-------------|
| BUG-01 | 7 | Favoritter persistence |
| BUG-02 | 7 | Tags tilfoej/rediger/vis |
| BUG-03 | 7 | Filter efter tags |
| BUG-04 | 8 | Tilfoej til fremtidige uger |
| BUG-05 | 6 | Indkobsliste kilde-visning |
| BUG-06 | 6 | Danske tegn |
| UI-01 | 8 | Liste/grid toggle |
| UI-02 | 6 | Ny bundmenu |
| FEAT-01 | 8 | Madplan-noter |
| FEAT-02 | 8 | Note vises paa ugeplan |
| FEAT-03 | 7 | Ingredienser til indkobsliste |

**Coverage:** 11/11 requirements mapped (100%)

---
*Roadmap created: 2026-01-26*
*Phase 7 planned: 2026-01-26*
