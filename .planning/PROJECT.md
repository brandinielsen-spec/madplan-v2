# Madplan App v2

## What This Is

En moderne madplanlægnings-app der gør det nemt at planlægge ugens måltider, importere opskrifter smart fra billeder og URL'er, og holde styr på indkøb. Bygget som PWA med app-lignende oplevelse til familie og venner.

## Core Value

**Ubesværet madplanlægning med smarte opskrifter.** Brugeren skal kunne gå fra "jeg fandt en opskrift" til "den er i min ugeplan" med minimal friktion.

## Requirements

### Validated

<!-- Arvet fra v1 — dette virker allerede -->

- ✓ Ugeplan med mandag-søndag visning — v1
- ✓ Navigation mellem uger (ISO-ugenummer) — v1
- ✓ Tilføj/rediger/slet retter på dage — v1
- ✓ Opskrifter med titel, portioner, ingredienser, fremgangsmåde — v1
- ✓ Genbrug af opskrifter på tværs af uger — v1
- ✓ Auto-genereret indkøbsliste fra ugens retter — v1
- ✓ Manuelle indkøbsposter — v1
- ✓ Afkrydsning af indkøbsposter — v1
- ✓ Kopiér uge funktionalitet — v1
- ✓ Ejer-koncept (kontekst-switching) — v1

### Active

<!-- v2 scope — bygges nu -->

**UI/UX:**
- [ ] Moderne UI med shadcn/ui komponenter
- [ ] PWA (installerbar på mobil)
- [ ] Swipe gestures til navigation mellem uger
- [ ] Hurtig navigation uden page reloads
- [ ] Mobil-first responsivt design

**Smart Import:**
- [ ] Import opskrift fra URL med fuld udtrækning
- [ ] Import opskrift fra billede (OCR)
- [ ] Detect URL på billede og hent derfra i stedet
- [ ] Gem opskriftsbillede hvis tilgængeligt

**Organisering:**
- [ ] Favorit-markering på opskrifter
- [ ] Tags/kategorier på opskrifter (Hurtig, Vegetar, Gæstemad, etc.)
- [ ] Søg og filtrer opskrifter

**n8n:**
- [ ] Alle workflows tagget med version (ver2)

### Out of Scope

- Drag & drop på ugeplan — v2.1, UI-kompleksitet
- Smart indkøbsliste (kategorier, sammenlægning) — v2.1
- Del indkøbsliste — v2.1
- AI-madforslag — v2.1, kræver mere research
- Sæson-ingredienser — v2.1
- Portionsjustering per dag — v2.1
- Login og brugerkonti — holder det simpelt
- Multi-bruger sync — ejer-koncept er nok
- Kalorier/ernæring — ikke relevant for use case
- Supermarked-integration — for komplekst
- Offline support — ikke prioriteret

## Context

**Baseret på v1:**
- v1 er en fungerende app med Next.js + Airtable + n8n
- v1 kode ligger i `../Madplan/madplan/`
- v1 n8n workflows ligger i `../Madplan/n8n-workflows/`
- v2 er en ny kodebase, men genbruger Airtable struktur og n8n patterns

**Brugere:**
- Familie og venner (ikke offentlig)
- Dansk som primært sprog

**Eksisterende n8n workflows (v1):**
- madplan-hent-ejere
- madplan-hent-indkoebsliste
- madplan-hent-opskrifter
- madplan-hent-uge
- madplan-import-opskrift-billede
- madplan-import-opskrift-url
- madplan-opdater-dag
- madplan-opdater-opskrift
- madplan-opret-opskrift
- madplan-slet-dag
- madplan-tilfoej-indkoebspost

## Constraints

- **Database**: Airtable — beholdes fra v1, fungerer godt
- **Backend**: n8n workflows — beholdes, alle nye workflows tagges ver2
- **Frontend**: Next.js + TypeScript + shadcn/ui — ny kodebase
- **Sprog**: Dansk UI, dansk i kode-kommentarer er OK
- **Platform**: Web med PWA, mobil-first

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ny kodebase i stedet for refaktor | Renere arkitektur, moderne patterns fra start | — Pending |
| shadcn/ui som komponent-bibliotek | Moderne, tilpasseligt, god mobil-support | — Pending |
| Behold Airtable | Fungerer, nemt at inspicere data, ingen migration | — Pending |
| Kernen først (v2), resten senere (v2.1) | Grundigt arbejde frem for feature creep | — Pending |

---
*Last updated: 2025-01-24 after initialization*
