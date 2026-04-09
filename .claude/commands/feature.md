# Scaffold New Feature

Scaffold a complete vertical slice for a new feature following project conventions.

## Arguments
- `$ARGUMENTS` — feature name in kebab-case (e.g., `sla-breach`, `ticket-export`)

## Instructions

Take the feature name from `$ARGUMENTS`. Derive these naming variants:
- **kebab**: `$ARGUMENTS` as-is (e.g., `sla-breach`)
- **PascalCase**: capitalize first letter of each hyphen-separated segment, join without hyphens (e.g., `SlaBreach`)
- **ServiceClass**: `${PascalCase}Service` (e.g., `SlaBreachService`)

### Step 1: Create `schemas/$ARGUMENTS.schema.ts`

```typescript
import { z } from "zod"

export const ${PascalCase}InputSchema = z.object({
  // TODO: define input fields
})

export const ${PascalCase}OutputSchema = z.object({
  success: z.boolean(),
  // TODO: define output fields
})

export type ${PascalCase}Input = z.infer<typeof ${PascalCase}InputSchema>
export type ${PascalCase}Output = z.infer<typeof ${PascalCase}OutputSchema>
```

### Step 2: Create `server/services/$ARGUMENTS.service.ts`

```typescript
import { createLogger } from "@/lib/logger"
import type { ${PascalCase}Input, ${PascalCase}Output } from "@/schemas/$ARGUMENTS.schema"

const logger = createLogger("${PascalCase}")

export class ${ServiceClass} {
  async process(input: ${PascalCase}Input): Promise<${PascalCase}Output> {
    logger.info("Processing $ARGUMENTS", { input })
    // TODO: implement business logic
    throw new Error("Not implemented")
  }
}
```

### Step 3: Create `app/api/$ARGUMENTS/route.ts`

```typescript
import { ${ServiceClass} } from "@/server/services"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { ${PascalCase}InputSchema } from "@/schemas/$ARGUMENTS.schema"

const service = new ${ServiceClass}()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ${PascalCase}InputSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.message)
    }
    const result = await service.process(parsed.data)
    return apiSuccess({ result })
  } catch (error) {
    return handleApiError(error, "POST /api/$ARGUMENTS")
  }
}
```

### Step 4: Update `server/services/index.ts`

Add this export line in alphabetical order among the existing exports:

```typescript
export { ${ServiceClass} } from "./$ARGUMENTS.service"
```

### Step 5: Update codemaps

Add entries to:
- **`docs/CODEMAPS/services.md`** — new `## ${ServiceClass}` section at the end
- **`docs/CODEMAPS/api-routes.md`** — new `## POST /api/$ARGUMENTS` section at the end

### Step 6: Verify

- `app/api/$ARGUMENTS/route.ts` must be under 80 lines
- `server/services/$ARGUMENTS.service.ts` must be under 250 lines
- `schemas/$ARGUMENTS.schema.ts` must be under 100 lines
- Run `npm run build` (or note TypeScript gaps to fill in service implementation)
