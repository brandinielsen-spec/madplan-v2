# Phase 2: Core Data Flow - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Brugere kan tilgå v1 funktionalitet gennem ny UI — se ugeplan, navigere mellem uger, tilføje/redigere/slette retter, og se/afkrydse indkøbsliste. API routes proxyer til eksisterende n8n workflows.

</domain>

<decisions>
## Implementation Decisions

### Ugeplan layout
- Vertikal stack af dage — scroll ned gennem ugen
- Hver dag viser: titel + thumbnail (hvis tilgængeligt og hurtigt at loade)
- Én ret per dag (simpel model som v1)
- Quick add + modal: tap for hurtig tilføjelse (senest brugte), long-press for fuld vælger med søgning

### Indkøbsliste interaction
- Tap på item/checkbox for at markere som købt
- Items grupperet efter kategori (Grønt, Mejeri, Kød, etc.)
- Afkrydsede items flyttes til bunden med strikethrough
- Brugere kan tilføje custom items (ikke kun fra opskrifter)

### Opskrifter display
- Toggle mellem to visninger: cards med billeder og kompakt liste
- Default: Cards (visuel)
- Cards viser kun titel + billede (rent, minimalt)
- Tap på opskrift navigerer til fuld detalje-side

### Claude's Discretion
- Error state visning (inline vs toast baseret på fejltype)
- Empty state design (simpel besked vs illustration)
- Refresh strategi (manual vs auto baseret på view)

</decisions>

<specifics>
## Specific Ideas

- Thumbnail på ugeplan-entries kun hvis det ikke går ud over load-tiden
- Indkøbsliste skal være praktisk til brug i supermarkedet (kategorier hjælper med at finde varer)
- Opskrift-cards skal være rene og visuelle — mad-app æstetik

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-data-flow*
*Context gathered: 2026-01-24*
