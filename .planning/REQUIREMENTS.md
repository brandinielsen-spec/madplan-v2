# Requirements: Madplan v2

**Defined:** 2025-01-24
**Core Value:** Ubesværet madplanlægning med smarte opskrifter

## v1 Requirements (Validated)

Arvet fra v1 — allerede fungerende funktionalitet.

### Ugeplan
- ✓ **UGE-01**: Ugevisning med mandag-søndag
- ✓ **UGE-02**: Navigation mellem uger med ISO-ugenummer
- ✓ **UGE-03**: Tilføj ret til dag
- ✓ **UGE-04**: Rediger ret på dag
- ✓ **UGE-05**: Slet ret fra dag
- ✓ **UGE-06**: Kopiér hel uge til anden uge

### Opskrifter
- ✓ **OPS-01**: Opret opskrift med titel, portioner, ingredienser, fremgangsmåde
- ✓ **OPS-02**: Rediger eksisterende opskrift
- ✓ **OPS-03**: Genbrug opskrift på tværs af uger
- ✓ **OPS-04**: Opskrift kan eksistere uden at være brugt i uge

### Indkøbsliste
- ✓ **IND-01**: Auto-genereret indkøbsliste fra ugens retter
- ✓ **IND-02**: Tilføj manuel indkøbspost
- ✓ **IND-03**: Afkryds indkøbspost
- ✓ **IND-04**: Manuelle poster bevares ved ugeplan-ændringer

### Ejer/Kontekst
- ✓ **EJR-01**: Vælg mellem ejere (kontekst-switching)
- ✓ **EJR-02**: Ejer bestemmer ugeplaner, opskrifter, indkøbsliste

## v2 Requirements

### UI/UX
- [x] **UIX-01**: Moderne UI med shadcn/ui komponenter
- [x] **UIX-02**: PWA — installerbar på mobil som app
- [x] **UIX-03**: Hurtig navigation uden page reloads
- [ ] **UIX-04**: Swipe gestures til navigation mellem uger
- [x] **UIX-05**: Mobil-first responsivt design

### Smart Import
- [ ] **IMP-01**: Import opskrift fra URL med auto-udtrækning
- [ ] **IMP-02**: Import opskrift fra billede med OCR
- [ ] **IMP-03**: Detect URL i billede og hent derfra i stedet
- [ ] **IMP-04**: Gem opskriftsbillede hvis tilgængeligt fra URL
- [ ] **IMP-05**: Preview importeret opskrift før gem
- [ ] **IMP-06**: Rediger importeret data før gem

### Organisering
- [ ] **ORG-01**: Favorit-markering på opskrifter
- [ ] **ORG-02**: Tags på opskrifter (bruger-definerede)
- [ ] **ORG-03**: Søg i opskrifter (titel)
- [ ] **ORG-04**: Filter opskrifter på tags
- [ ] **ORG-05**: Filter opskrifter på favoritter

### n8n Workflows
- [ ] **N8N-01**: Alle workflows versioneres med inkrementelt nummer (1, 2, 3...) ved ændringer

## v2.1 Requirements (Deferred)

### Ugeplan Enhancement
- **UGE-10**: Drag & drop retter mellem dage
- **UGE-11**: Portionsjustering per dag

### Smart Indkøbsliste
- **IND-10**: Gruppér indkøbsposter efter kategori
- **IND-11**: Smart sammenlægning af dubletter
- **IND-12**: Del indkøbsliste via link

### AI Features
- **AI-01**: AI madforslag baseret på historik
- **AI-02**: Auto-tag suggestions baseret på ingredienser
- **AI-03**: Søg i ingredienser ("hvad kan jeg lave med kylling?")

### Import Enhancement
- **IMP-10**: Batch import (multiple billeder/URLs)
- **IMP-11**: Import historik med undo

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login og brugerkonti | Holder det simpelt, ejer-koncept er nok |
| Multi-bruger sync | Ikke nødvendigt for familie/venner use case |
| Kalorier/ernæring | Ikke relevant for målgruppen |
| Supermarked-integration | For komplekst, ikke core value |
| Offline support | Ikke prioriteret i v2, kan tilføjes senere |
| Voice commands | Niche feature, høj kompleksitet |
| Gamification | Ikke relevant, brugere vil have effektivitet |
| Social/offentlig deling | Privat familie-app |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UIX-01 | Phase 1: Foundation | Complete |
| UIX-02 | Phase 1: Foundation | Complete |
| UIX-03 | Phase 2: Core Data Flow | Complete |
| UIX-04 | Phase 3: PWA Enhancement | Pending |
| UIX-05 | Phase 1: Foundation | Complete |
| IMP-01 | Phase 4: Smart Import | Pending |
| IMP-02 | Phase 4: Smart Import | Pending |
| IMP-03 | Phase 4: Smart Import | Pending |
| IMP-04 | Phase 4: Smart Import | Pending |
| IMP-05 | Phase 4: Smart Import | Pending |
| IMP-06 | Phase 4: Smart Import | Pending |
| ORG-01 | Phase 5: Organization | Pending |
| ORG-02 | Phase 5: Organization | Pending |
| ORG-03 | Phase 5: Organization | Pending |
| ORG-04 | Phase 5: Organization | Pending |
| ORG-05 | Phase 5: Organization | Pending |
| N8N-01 | Phase 4: Smart Import | Pending |

**Coverage:**
- v2 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2025-01-24*
*Last updated: 2026-01-24 after Phase 2 completion*
