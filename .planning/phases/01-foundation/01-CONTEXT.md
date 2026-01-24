# Phase 1: Foundation - Context

**Gathered:** 2025-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Moderne app shell med PWA kapabilitet. Brugere kan åbne og installere app'en, se moderne UI med shadcn/ui styling, og navigere mellem placeholder-sider. Selve funktionaliteten (data, opskrifter, etc.) kommer i Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Visuel identitet
- Stemning: Varm & hyggelig — bløde farver, runde former, føles som et køkken
- Farveskema: Jordfarver — beige, terracotta, oliven (naturlige køkkentoner)
- Typografi: Afrundet sans-serif til overskrifter (Nunito/Poppins-stil)
- Kun light mode — simplere, jordfarver virker bedst i lys

### Navigation
- Bundmenu med 4 items: Ugeplan, Opskrifter, Tilføj, Indkøb
- Header med actions på hver side (titel + relevante knapper som søg, filter)
- Dashboard som startside — overblik med dagens ret, indkøbsliste status, etc.

### Sidelayout
- Balanceret indholdstæthed — læsbart men effektivt
- Opskrifter vises som kort med billede (billede + titel + kort info)
- Ugeplan som vertikal liste — scroll ned gennem dagene
- Empty states med illustration + tekst og CTA

### App branding
- App navn: "Madplan"
- Ikon: Kalender + mad kombination
- Splash screen: App-ikon med "Madplan" under
- Theme color: Varm beige/sand (matcher jordfarve-tema)

### Claude's Discretion
- Præcise farvekoder inden for jordfarve-paletten
- Specifikke font-valg (Nunito vs Poppins vs lignende)
- Spacing og typografi-skala
- Animationer og transitions
- Præcis ikon-design
- Loading states og skeleton design

</decisions>

<specifics>
## Specific Ideas

- App skal "føles som et køkken" — varm, venlig, hyggelig
- Dashboard giver overblik — brugeren ser straks hvad der er relevant i dag
- Bundmenu giver hurtig adgang til at tilføje ny opskrift (dedikeret + knap)
- Illustrationer i empty states — venlige, ikke bare tekst

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2025-01-24*
