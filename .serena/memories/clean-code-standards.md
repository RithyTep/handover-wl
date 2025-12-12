# Clean Code Standards 2025

Quick reference for AI agents. Based on latest research from Clean Code, Bulletproof React, and 2025 industry standards.

## Critical Limits

| Type | Max Lines | Max Functions | Max Params |
|------|-----------|---------------|------------|
| API Route | **80** | 3 | 4 |
| Service | **250** | 10 | 4 |
| Component | **200** | 5 | 4 |
| Hook | **100** | 3 | 4 |
| Utility | **150** | 8 | 4 |
| Function | **30** | - | 4 |

## Before Adding Code

```
1. Check current file line count
2. If > 80% of limit → refactor first
3. Follow existing patterns
4. Don't mix concerns
```

## Architecture Pattern

```
Request → API Route (thin) → Service (logic) → Repository (data)
                                    ↓
                              Lib Utils (external APIs)
```

## Quick Patterns

### API Route (< 80 lines)
```typescript
import { Service } from '@/server/services'
import { apiSuccess, handleApiError } from '@/lib/api'

const service = new Service()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await service.process(body)
    return apiSuccess({ result })
  } catch (error) {
    return handleApiError(error, 'POST /api/endpoint')
  }
}
```

### Service (< 250 lines)
```typescript
import { createLogger } from '@/lib/logger'

const logger = createLogger('Feature')

export class FeatureService {
  async process(input: Input): Promise<Output> {
    logger.info('Processing', { input })
    // Business logic only
    return result
  }
}
```

### Component (< 200 lines)
```typescript
interface Props {
  data: Data
  onAction: () => void
}

export function Feature({ data, onAction }: Props) {
  const { state, handler } = useFeatureLogic(data)

  return (
    <Container>
      <FeatureHeader data={data} />
      <FeatureContent state={state} />
      <FeatureActions onAction={handler} />
    </Container>
  )
}
```

## Refactoring Actions

| When You See | Do This |
|--------------|---------|
| File > limit | Split into focused modules |
| Function > 30 lines | Extract helpers |
| > 4 params | Use options object |
| Nesting > 3 | Early returns, extract |
| HTTP + logic | Move logic to service |
| Duplicate code | Extract to shared |

## Don't

- ❌ `any` type → use `unknown` or proper type
- ❌ `console.log` → use `logger`
- ❌ Business logic in routes → use services
- ❌ Deep nesting → early returns
- ❌ God files → split by concern
- ❌ Inline magic values → use constants

## Do

- ✅ Check file size before editing
- ✅ Follow existing patterns
- ✅ Single responsibility per file
- ✅ Extract when approaching limits
- ✅ Run build after changes
- ✅ Use TypeScript strictly

## Feature Module Structure

```
features/
└── tickets/
    ├── components/     # UI
    ├── hooks/          # State logic
    ├── services/       # Business logic
    ├── types/          # Types
    └── index.ts        # Public API
```

## SOLID Quick Reference

- **S**: One responsibility per file/class/function
- **O**: Extend via composition, not modification
- **L**: Components sharing interface are swappable
- **I**: Props should only include what's needed
- **D**: Depend on interfaces, not implementations

## File Naming

```
feature-name.service.ts
feature-name.repository.ts
feature-name.tsx
use-feature-name.ts
feature-name.types.ts
```

## Import Order

```typescript
// 1. React/Next
// 2. External packages
// 3. Internal (@/)
// 4. Relative
```

## Sources

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Clean Code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [Rule of 30](https://dzone.com/articles/rule-30-–-when-method-class-or)
- [Feature-Sliced Design](https://feature-sliced.design/)
