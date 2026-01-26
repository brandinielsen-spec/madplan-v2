# Requirements: Madplan v2.1 Bug Fixes & Polish

**Defined:** 2026-01-26
**Core Value:** Ubesvaeret madplanlaegning med smarte opskrifter

## v2.1 Requirements

Requirements for this milestone. Fixes incomplete v2.0 features and adds UX improvements.

### Bug Fixes

- [x] **BUG-01**: Favoritter gemmes til Airtable naar bruger toggler (UI virker, persistence mangler)
- [x] **BUG-02**: Tags kan tilfojes, redigeres og vises pa opskrifter (funktionen mangler helt)
- [x] **BUG-03**: Bruger kan filtrere opskrifter efter tags
- [ ] **BUG-04**: Bruger kan tilfoeje ret til madplan for alle uger (ikke kun aktuel uge)
- [x] **BUG-05**: Indkobsliste viser korrekt kilde (opskrift-navn eller "Tilfojet manuelt")
- [x] **BUG-06**: Danske tegn vises korrekt i UI (Indkob → Indkoeb, TILFOEJET → TILFOJET med oe/oe)

### UI Improvements

- [ ] **UI-01**: Madplan har liste/grid view toggle (som pa opskrifter-siden)
- [x] **UI-02**: Bundmenu viser 5 ikoner i raekkefoelge: Hjem, Ugeplan, Opskrifter, Tilfoej, Indkoeb

### New Features

- [ ] **FEAT-01**: Bruger kan tilfoeje kort note til ret pa madplan (fx "Rest", "Fra frost")
- [ ] **FEAT-02**: Note vises under opskrift-titel pa ugeplan
- [x] **FEAT-03**: Bruger kan tilfoeje opskrifts ingredienser til indkobsliste med et klik

## v2.2 Requirements

Deferred to future release.

### Smart Shopping

- **SHOP-01**: Indkobsliste grupperet efter kategori
- **SHOP-02**: Sammenlaegning af ens ingredienser

### Advanced Features

- **ADV-01**: Drag & drop pa ugeplan
- **ADV-02**: AI-madforslag

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login og brugerkonti | Holder det simpelt, ejer-koncept er nok |
| Multi-bruger sync | Ejer-koncept daekker use case |
| Kalorier/ernaering | Ikke relevant for brugerne |
| Supermarked-integration | For komplekst |
| Del indkobsliste | Kan tilfojes i v2.2 hvis onsket |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 7 | Complete |
| BUG-02 | Phase 7 | Complete |
| BUG-03 | Phase 7 | Complete |
| BUG-04 | Phase 8 | Pending |
| BUG-05 | Phase 6 | Complete |
| BUG-06 | Phase 6 | Complete |
| UI-01 | Phase 8 | Pending |
| UI-02 | Phase 6 | Complete |
| FEAT-01 | Phase 8 | Pending |
| FEAT-02 | Phase 8 | Pending |
| FEAT-03 | Phase 7 | Complete |

**Coverage:**
- v2.1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-01-26 after Phase 7 completion*
