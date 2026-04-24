# Token-Effective Claude Ecosystem — Design Spec

**Date:** 2026-04-09  
**Status:** Approved  
**Project:** jira-slack-integration

---

## Goal

Reduce token consumption and lost context across Claude sessions by setting up persistent codebase indexing, structural codemaps, automated file-size guardrails, and an improved feature scaffolding command.

---

## Four Components

### 1. claude-mem Codebase Indexing (cross-session memory)

Run `claude-mem:smart-explore` once to index the entire codebase using tree-sitter AST parsing. This creates a persistent symbol database that survives across sessions.

**Effect:** Future sessions use `smart_search "jira service"` or `smart_outline "TicketService"` instead of reading 14 service files to find a method. Eliminates the "re-explain the codebase" tax on every new session.

**Scope:** All TypeScript files in `app/`, `server/`, `lib/`, `components/`, `hooks/`, `schemas/`, `interfaces/`, `enums/`.

---

### 2. Codemaps (in-session structural navigation)

Three static snapshot files in `docs/CODEMAPS/`, committed to git:

| File | Contents | Replaces |
|------|----------|----------|
| `services.md` | All service classes + public method signatures + file paths | Reading 14 service files |
| `api-routes.md` | All 40+ endpoints: method, path, request shape, response shape, auth | Reading 40+ route.ts files |
| `components.md` | Component tree, key props, which hook/service each component uses | Reading 42 component files |

**Format:** Compact — each entry is 3–5 lines max. No implementation details, only structure.

**Update rule:** When adding or modifying a service/route/component, update the relevant codemap in the same commit. The `/feature` command includes a reminder step for this.

---

### 3. PostToolUse File-Size Hook (automated guardrail)

Added to `.claude/settings.local.json` in the `hooks` section.

**Trigger:** After every `Write` or `Edit` tool call.  
**Behavior:** Non-blocking — prints a one-line warning to the terminal if the modified file exceeds its type limit. Claude continues regardless.

**Limit map:**
```
app/api/**/route.ts    → 80 lines
server/services/**     → 250 lines
server/repository/**   → 200 lines
components/**          → 200 lines
hooks/**               → 100 lines
lib/**                 → 150 lines
```

**Implementation:** A small bash script at `.claude/hooks/check-file-size.sh`. Takes the file path as `$1`, determines its type by path pattern, counts lines with `wc -l`, and prints a warning if exceeded.

---

### 4. /feature Scaffolding Command (`.claude/commands/feature.md`)

Replaces the 4-step manual `/new-api` flow with a single command that scaffolds a complete vertical slice.

**Input:** Feature name (e.g., `sla-breach`)

**Output — files created:**
```
schemas/sla-breach.schema.ts          # Zod input/output schemas
server/services/sla-breach.service.ts # Business logic class
app/api/sla-breach/route.ts           # Thin API route
```

**Output — files updated:**
```
server/services/index.ts              # Barrel export added
docs/CODEMAPS/services.md            # Entry added
docs/CODEMAPS/api-routes.md          # Endpoint added
```

**Enforces from the start:** correct file locations, logger import, `apiSuccess`/`badRequest`/`handleApiError`, Zod validation, no business logic in route.

---

## Out of Scope

- No blocking hooks (user confirmed: warnings only)
- No auto-run of `npm run build` on Stop (too slow for a hook)
- No per-component codemap (component tree in one file is sufficient)
- Codemaps are manually maintained, not auto-generated (simpler, avoids build-step dependency)

---

## Files Changed / Created

```
docs/CODEMAPS/services.md              (new)
docs/CODEMAPS/api-routes.md            (new)
docs/CODEMAPS/components.md            (new)
docs/superpowers/specs/2026-04-09-token-effective-claude-ecosystem-design.md  (new)
.claude/commands/feature.md            (new)
.claude/hooks/check-file-size.sh       (new)
.claude/settings.local.json            (modified — add hooks section)
CLAUDE.md                              (modified — add codemaps reference)
```

claude-mem indexing: run once interactively, no file changes.

---

## Success Criteria

- New session: Claude can answer "where is SLA logic handled?" via `smart_search` without reading any source files
- New session: Claude reads `docs/CODEMAPS/services.md` instead of 14 service files to understand service layer
- After any Write/Edit: terminal shows file-size warning if limit exceeded
- `/feature sla-breach` creates all 3 files + updates 2 files correctly in one shot
