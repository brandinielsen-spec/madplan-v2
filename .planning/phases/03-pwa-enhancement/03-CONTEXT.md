# Phase 3: PWA Enhancement - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the app feel native with gesture-based week navigation and offline caching. Users can swipe between weeks smoothly and access cached data when offline. Service worker handles caching strategies.

</domain>

<decisions>
## Implementation Decisions

### Swipe behavior
- Swipe gestures work on the whole Ugeplan page (not just day cards)
- Distance threshold triggers week change (swipe past 30-40% of screen width)
- Incomplete swipe snaps back smoothly to current week

### Week boundaries
- Hard stop at earliest week (no elastic bounce or wrap-around)
- Navigation range: 4 weeks into the past, 4 weeks into the future
- Week label in header is the only position indicator (no dots)

### Visual feedback
- Slide transition when swiping between weeks (like native iOS pages)
- Peek preview: next/previous week edge visible during swipe
- Arrow button taps trigger the same slide animation as swiping

### Offline experience
- Read-only access when offline (view cached data, can't make changes)
- Subtle persistent banner at top when offline: "Du er offline"
- Pre-cache current week + next week on first load
- Refresh cached data each time app comes to foreground

### Claude's Discretion
- Horizontal scroll vs swipe conflict handling (angle detection approach)
- Header update timing during swipe (after completion vs mid-swipe crossfade)
- Exact animation durations and easing curves
- Service worker caching strategy details

</decisions>

<specifics>
## Specific Ideas

- Native iOS feel for swipe gestures — smooth, responsive, predictable
- Meal planning is forward-looking, but 4 weeks of history for reference
- Offline should feel seamless — users may not notice they're offline until they try to edit

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-pwa-enhancement*
*Context gathered: 2026-01-24*
