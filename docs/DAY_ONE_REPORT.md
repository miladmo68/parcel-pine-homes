# Day one — Toronto 2026-11-08

## Product choice

Parcel & Pine is a real-estate discovery and viewing-planning product for a home buyer. It deliberately follows the restaurant storefront released on November 7 with a spatial search and comparison experience.

## Material differentiators

| Axis | Direction |
|---|---|
| Domain | Residential property discovery |
| Primary role | Toronto home buyer |
| Information architecture | Map/list search → shortlist → compare → detail → viewing plan |
| Core interaction | Spatial filtering and three-property comparison |
| Data model | Property, room, availability slot, viewing preview |
| Visual direction | Editorial field guide with cartographic surfaces |
| Type and colour | Newsreader serif, DM Sans, pine/cream/rust palette |
| Technical emphasis | Repository adapters, validated Express boundary, persistent client state |

## Research notes

- Current real-estate products emphasize saved searches, favourites, map/list switching, affordability context, and tour requests.
- The app turns those conventions into an original, secretless portfolio journey rather than copying a branded product.
- Pexels licensing was checked before selecting imagery. Individual source identifiers are retained in `ATTRIBUTIONS.md`.

## Day-one milestones

1. Exact-version Vite/React/Express/Mongoose workspace
2. Property domain and static/Mongo repository adapters
3. Zod-validated Express routes, controller, service, and error handling
4. Responsive map/list discovery and compound filters
5. Persistent saved homes and comparison workspace
6. Property details and validated viewing-plan preview
7. Editorial collections, neighbourhood guide, keyboard shortcut, and responsive states
8. Domain tests, browser-journey harness, attribution record, and staged documentation

Publication remains intentionally disabled until day two.
