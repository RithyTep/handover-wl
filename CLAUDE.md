# Project Rules & Clean Code Guidelines (2025 Edition)

This document defines coding standards based on latest 2025 best practices from Clean Code, Bulletproof React, Feature-Sliced Design, and industry research.

> **Sources**: [Bulletproof React](https://github.com/alan2207/bulletproof-react), [Clean Code TypeScript](https://github.com/labs42io/clean-code-typescript), [Next.js Clean Architecture](https://github.com/nikolovlazar/nextjs-clean-architecture), [Feature-Sliced Design](https://feature-sliced.design/)

---

## Golden Rules

1. **Files should be SMALL** - Easy to read, test, and maintain
2. **Single Responsibility** - Each file/class/function does ONE thing
3. **Extract, Don't Expand** - When adding features, create new files
4. **Depend on Abstractions** - Use interfaces, not concrete implementations
5. **Colocation** - Keep related code together (feature-based organization)

---

## File Size Limits (ENFORCED)

Based on [Rule of 30](https://dzone.com/articles/rule-30-–-when-method-class-or) and industry research:

| File Type | Max Lines | Max Functions | Action When Exceeded |
|-----------|-----------|---------------|---------------------|
| **API Routes** | 80 | 3 | Extract to service |
| **Services** | 250 | 10 | Split by feature |
| **Components** | 200 | 5 | Extract sub-components |
| **Hooks** | 100 | 3 | Split by concern |
| **Utilities** | 150 | 8 | Split by domain |
| **Types** | 100 | - | Split by feature |

### Function Size Limits

| Metric | Limit | Source |
|--------|-------|--------|
| Lines per function | **30** | Rule of 30, Clean Code |
| Cyclomatic complexity | **10** | ESLint default recommendation |
| Parameters | **4** | Clean Code |
| Nesting depth | **3** | Industry standard |

---

## Architecture: Feature-Sliced Design

Based on [Bulletproof React](https://github.com/alan2207/bulletproof-react) and [Feature-Sliced Design](https://feature-sliced.design/):

```
src/
├── app/                    # Next.js App Router (routing layer - THIN)
│   └── api/               # API routes (< 80 lines each)
│
├── features/              # Feature modules (self-contained)
│   └── tickets/
│       ├── api/           # Feature API logic
│       ├── components/    # Feature UI components
│       ├── hooks/         # Feature hooks
│       ├── services/      # Feature business logic
│       ├── types/         # Feature types
│       └── index.ts       # Public API (barrel file)
│
├── shared/                # Shared across features
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Reusable hooks
│   ├── lib/               # Utilities, clients, helpers
│   └── types/             # Shared type definitions
│
└── server/                # Server-only code
    ├── services/          # Business logic services
    └── repositories/      # Data access layer
```

### Feature Module Structure

Each feature is a **vertical slice** containing everything it needs:

```typescript
// features/tickets/index.ts (Public API)
export { TicketsList } from './components/tickets-list'
export { useTickets } from './hooks/use-tickets'
export { ticketService } from './services/ticket.service'
export type { Ticket, TicketStatus } from './types'
```

---

## Code Patterns (2025)

### 1. API Route Pattern (< 80 lines)

```typescript
// app/api/feature/route.ts
import { FeatureService } from '@/server/services'
import { apiSuccess, badRequest, handleApiError } from '@/shared/lib/api'
import { featureSchema } from './schema'

const service = new FeatureService()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate with Zod
    const parsed = featureSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.message)
    }

    const result = await service.process(parsed.data)
    return apiSuccess({ result })
  } catch (error) {
    return handleApiError(error, 'POST /api/feature')
  }
}
```

### 2. Service Pattern (< 250 lines)

```typescript
// server/services/feature.service.ts
import { createLogger } from '@/shared/lib/logger'
import type { FeatureRepository } from '../repositories'

const logger = createLogger('Feature')

export class FeatureService {
  constructor(private repository: FeatureRepository) {} // DI

  async process(input: Input): Promise<Output> {
    logger.info('Processing', { input })

    // Business logic only - no HTTP, no direct DB
    const data = await this.repository.findById(input.id)
    return this.transform(data)
  }

  private transform(data: RawData): Output {
    // Keep private helpers small
  }
}
```

### 3. Component Pattern (< 200 lines)

```typescript
// features/tickets/components/ticket-card.tsx
import { useTicketActions } from '../hooks/use-ticket-actions'
import type { Ticket } from '../types'

interface TicketCardProps {
  ticket: Ticket
  onUpdate?: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onUpdate }: TicketCardProps) {
  const { handleSave, isLoading } = useTicketActions(ticket.id)

  // Component logic here - keep render clean

  return (
    <Card>
      <TicketHeader ticket={ticket} />
      <TicketBody ticket={ticket} />
      <TicketActions onSave={handleSave} loading={isLoading} />
    </Card>
  )
}
```

### 4. Custom Hook Pattern (< 100 lines)

```typescript
// features/tickets/hooks/use-ticket-actions.ts
export function useTicketActions(ticketId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSave = useCallback(async (data: TicketData) => {
    setIsLoading(true)
    try {
      await ticketService.save(ticketId, data)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [ticketId])

  return { handleSave, isLoading, error }
}
```

---

## SOLID Principles in React/TypeScript

### S - Single Responsibility
```typescript
// ❌ BAD: Component does too much
function TicketPage() {
  // Fetches data, handles form, renders UI, manages state
}

// ✅ GOOD: Split responsibilities
function TicketPage() {
  const { ticket } = useTicket(id)        // Data fetching
  return <TicketForm ticket={ticket} />   // UI only
}
```

### O - Open/Closed (Use composition)
```typescript
// ✅ GOOD: Extend via composition
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

function IconButton({ icon, ...props }: ButtonProps & { icon: ReactNode }) {
  return <Button {...props}>{icon} {props.children}</Button>
}
```

### L - Liskov Substitution (Use TypeScript!)
```typescript
// ✅ GOOD: Components sharing same interface are interchangeable
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
}

// Both can replace each other
function SimpleTable<T>(props: DataTableProps<T>) { }
function VirtualizedTable<T>(props: DataTableProps<T>) { }
```

### I - Interface Segregation
```typescript
// ❌ BAD: Component depends on unused props
interface UserProps {
  user: User  // Has 20 fields
}

// ✅ GOOD: Only what's needed
interface UserCardProps {
  name: string
  avatar: string
}
```

### D - Dependency Inversion
```typescript
// ❌ BAD: Direct dependency
import { prisma } from '@/lib/prisma'
class TicketService {
  async find() { return prisma.ticket.findMany() }
}

// ✅ GOOD: Depend on abstraction
interface TicketRepository {
  findAll(): Promise<Ticket[]>
}
class TicketService {
  constructor(private repo: TicketRepository) {}
  async find() { return this.repo.findAll() }
}
```

---

## Clean Code Checklist

### Before Writing Code
- [ ] Will this file stay under the line limit?
- [ ] Is there an existing pattern to follow?
- [ ] Should I create a new feature module?
- [ ] Am I mixing concerns?

### After Writing Code
- [ ] File under line limit?
- [ ] Functions under 30 lines?
- [ ] Max 4 parameters per function?
- [ ] Nesting depth ≤ 3?
- [ ] No `any` types?
- [ ] No `console.log` (use logger)?
- [ ] Descriptive names?
- [ ] Tests for business logic?

### Before Committing
- [ ] `npm run build` passes?
- [ ] No ESLint warnings?
- [ ] No TypeScript errors?

---

## Refactoring Triggers

**MUST refactor when you see:**

| Smell | Threshold | Action |
|-------|-----------|--------|
| File too long | > limit | Split by feature/concern |
| Function too long | > 30 lines | Extract helper functions |
| Too many params | > 4 | Use options object |
| Deep nesting | > 3 levels | Early returns, extract |
| Duplicate code | > 2 occurrences | Extract to shared |
| God component | > 200 lines | Extract sub-components |
| Mixed concerns | HTTP + logic | Move logic to service |

---

## Naming Conventions

### Files
```
feature-name.service.ts     # Services
feature-name.repository.ts  # Repositories
feature-name.tsx            # Components
use-feature-name.ts         # Hooks
feature-name.types.ts       # Types
```

### Code
```typescript
// Classes: PascalCase
class TicketService {}

// Functions/methods: camelCase
function getTicketById() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3

// Types/Interfaces: PascalCase
interface TicketData {}
type TicketStatus = 'open' | 'closed'

// Booleans: is/has/should prefix
const isLoading = true
const hasPermission = false
```

---

## Import Order

```typescript
// 1. React/Next
import { useState } from 'react'
import { NextResponse } from 'next/server'

// 2. External packages
import { z } from 'zod'

// 3. Internal absolute (@/)
import { Button } from '@/shared/components/ui'
import { useAuth } from '@/features/auth'
import type { User } from '@/shared/types'

// 4. Relative imports
import { helpers } from './utils'
```

---

## Error Handling

### API Routes
```typescript
import { apiSuccess, badRequest, handleApiError } from '@/shared/lib/api'

// Validation error
if (!data) return badRequest('Data required')

// Caught errors
catch (error) {
  return handleApiError(error, 'POST /api/feature')
}
```

### Services
```typescript
// Throw descriptive errors
if (!config.apiKey) {
  throw new Error('API key not configured. Set FEATURE_API_KEY env var.')
}
```

### Components
```typescript
// Use error boundaries for UI
<ErrorBoundary fallback={<ErrorFallback />}>
  <FeatureComponent />
</ErrorBoundary>
```

---

## Testing Guidelines

```typescript
// Test business logic in services
describe('TicketService', () => {
  it('should calculate priority correctly', () => {
    const service = new TicketService(mockRepo)
    expect(service.calculatePriority(ticket)).toBe('high')
  })
})

// Test hooks with React Testing Library
describe('useTickets', () => {
  it('should fetch tickets on mount', async () => {
    const { result } = renderHook(() => useTickets())
    await waitFor(() => expect(result.current.tickets).toHaveLength(3))
  })
})
```

---

## AI Assistant Instructions

When working on this codebase:

1. **Always check file size** before adding code
2. **Extract to new files** when approaching limits
3. **Follow feature-based structure** for new features
4. **Use existing patterns** - check similar files first
5. **Run build** after changes to verify types
6. **Prefer composition** over large components
7. **Keep API routes thin** - max 80 lines

### Refactoring Prompts for AI

```
"Refactor this file to be under [X] lines by extracting [concern] to a new service"
"Split this component into smaller sub-components"
"Extract this business logic from the API route to a service"
"Apply the Single Responsibility Principle to this class"
```
