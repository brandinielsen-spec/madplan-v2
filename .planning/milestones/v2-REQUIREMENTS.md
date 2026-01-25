# Requirements Archive: v2.0 Complete Rebuild

**Archived:** 2026-01-25
**Status:** SHIPPED

This is the archived requirements specification for v2.0.
For current requirements, see `.planning/REQUIREMENTS.md` (created for next milestone).

---

# Requirements: Madplan v2

**Defined:** 2025-01-24
**Core Value:** Ubesvaeret madplanlaegning med smarte opskrifter

## v1 Requirements (Validated)

Arvet fra v1 — allerede fungerende funktionalitet.

### Ugeplan
- [x] **UGE-01**: Ugevisning med mandag-sondag
- [x] **UGE-02**: Navigation mellem uger med ISO-ugenummer
- [x] **UGE-03**: Tilfoej ret til dag
- [x] **UGE-04**: Rediger ret pa dag
- [x] **UGE-05**: Slet ret fra dag
- [x] **UGE-06**: Kopier hel uge til anden uge

### Opskrifter
- [x] **OPS-01**: Opret opskrift med titel, portioner, ingredienser, fremgangsmade
- [x] **OPS-02**: Rediger eksisterende opskrift
- [x] **OPS-03**: Genbrug opskrift pa tvaers af uger
- [x] **OPS-04**: Opskrift kan eksistere uden at vaere brugt i uge

### Indkobsliste
- [x] **IND-01**: Auto-genereret indkobsliste fra ugens retter
- [x] **IND-02**: Tilfoej manuel indkobspost
- [x] **IND-03**: Afkryds indkobspost
- [x] **IND-04**: Manuelle poster bevares ved ugeplan-aendringer

### Ejer/Kontekst
- [x] **EJR-01**: Vaelg mellem ejere (kontekst-switching)
- [x] **EJR-02**: Ejer bestemmer ugeplaner, opskrifter, indkobsliste

## v2 Requirements

### UI/UX
- [x] **UIX-01**: Moderne UI med shadcn/ui komponenter — Phase 1: Complete
- [x] **UIX-02**: PWA — installerbar pa mobil som app — Phase 1: Complete
- [x] **UIX-03**: Hurtig navigation uden page reloads — Phase 2: Complete
- [x] **UIX-04**: Swipe gestures til navigation mellem uger — Phase 3: Complete
- [x] **UIX-05**: Mobil-first responsivt design — Phase 1: Complete

### Smart Import
- [x] **IMP-01**: Import opskrift fra URL med auto-udtraekning — Phase 4: Complete
- [x] **IMP-02**: Import opskrift fra billede med OCR — Phase 4: Complete
- [x] **IMP-03**: Detect URL i billede og hent derfra i stedet — Phase 4: Complete
- [x] **IMP-04**: Gem opskriftsbillede hvis tilgaengeligt fra URL — Phase 4: Complete
- [x] **IMP-05**: Preview importeret opskrift for gem — Phase 4: Complete
- [x] **IMP-06**: Rediger importeret data for gem — Phase 4: Complete

### Organisering
- [x] **ORG-01**: Favorit-markering pa opskrifter — Phase 5: Complete
- [x] **ORG-02**: Tags pa opskrifter (bruger-definerede) — Phase 5: Complete
- [x] **ORG-03**: Soeg i opskrifter (titel) — Phase 5: Complete
- [x] **ORG-04**: Filter opskrifter pa tags — Phase 5: Complete
- [x] **ORG-05**: Filter opskrifter pa favoritter — Phase 5: Complete

### n8n Workflows
- [x] **N8N-01**: Alle workflows versioneres med inkrementelt nummer — Phase 4: Complete

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login og brugerkonti | Holder det simpelt, ejer-koncept er nok |
| Multi-bruger sync | Ikke nodvendigt for familie/venner use case |
| Kalorier/ernaering | Ikke relevant for malgruppen |
| Supermarked-integration | For komplekst, ikke core value |
| ~~Offline support~~ | ~~Ikke prioriteret i v2~~ — Implemented in Phase 3 |
| Voice commands | Niche feature, hoj kompleksitet |
| Gamification | Ikke relevant, brugere vil have effektivitet |
| Social/offentlig deling | Privat familie-app |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UIX-01 | Phase 1: Foundation | Complete |
| UIX-02 | Phase 1: Foundation | Complete |
| UIX-03 | Phase 2: Core Data Flow | Complete |
| UIX-04 | Phase 3: PWA Enhancement | Complete |
| UIX-05 | Phase 1: Foundation | Complete |
| IMP-01 | Phase 4: Smart Import | Complete |
| IMP-02 | Phase 4: Smart Import | Complete |
| IMP-03 | Phase 4: Smart Import | Complete |
| IMP-04 | Phase 4: Smart Import | Complete |
| IMP-05 | Phase 4: Smart Import | Complete |
| IMP-06 | Phase 4: Smart Import | Complete |
| ORG-01 | Phase 5: Organization | Complete |
| ORG-02 | Phase 5: Organization | Complete |
| ORG-03 | Phase 5: Organization | Complete |
| ORG-04 | Phase 5: Organization | Complete |
| ORG-05 | Phase 5: Organization | Complete |
| N8N-01 | Phase 4: Smart Import | Complete |

**Coverage:**
- v2 requirements: 17 total
- Mapped to phases: 17
- Completed: 17 (100%)

---

## Milestone Summary

**Shipped:** 17 of 17 v2 requirements
**Adjusted:** None — all requirements shipped as originally specified
**Dropped:** None

---
*Archived: 2026-01-25 as part of v2.0 milestone completion*
