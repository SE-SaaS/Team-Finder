# Team-Finder Documentation

This folder contains the active documentation set for Team-Finder.

The documentation is intentionally focused on the artifacts currently used by
the project team: the current workflow diagram, the canonical ERD, and the
manual testing guide.

## Active Documents

| Document | Purpose |
| --- | --- |
| [WORKFLOW_DIAGRAM_V2.md](./WORKFLOW_DIAGRAM_V2.md) | Current canonical product workflow as one deep Mermaid graph |
| [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) | Existing workflow diagram kept for reference |
| [assets/erd.png](./assets/erd.png) | Canonical ERD image provided by the project architect |
| [../TESTING_GUIDE.md](../TESTING_GUIDE.md) | Manual testing guide |
| [../README.md](../README.md) | Main project README and setup entry point |

## Workflow

The current workflow source of truth is
[WORKFLOW_DIAGRAM_V2.md](./WORKFLOW_DIAGRAM_V2.md).

It shows the full user journey as a connected node graph:

- Landing and university-gated authentication.
- Dashboard access.
- Profile wizard completion as the required gate before project discovery.
- Project browsing, creation, detail views, and matching.
- Learning page features, including courses, dev tools, roadmaps, progress, and
  prefetching/resource enrichment.
- AI assistant connections to profile, skills, courses, learning progress,
  projects, and teammates.

## ERD

The ERD is not derived from SQL in this documentation pass. The canonical ERD is
the provided image:

![Team-Finder ERD](./assets/erd.png)

## Documentation Scope

This documentation set is scoped to the requested active docs only. Stale
architecture, function inventory, data generator, migration, and historical fix
documents were removed from the active documentation folder.
