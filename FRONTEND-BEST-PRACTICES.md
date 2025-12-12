# Frontend Best Practices 2025

> Comprehensive guide for Next.js, React, and TypeScript development based on latest industry standards.

## Table of Contents

1. [Architecture Patterns](#1-architecture-patterns)
2. [Next.js 15 App Router](#2-nextjs-15-app-router)
3. [React Server Components](#3-react-server-components)
4. [Component Design](#4-component-design)
5. [State Management](#5-state-management)
6. [TypeScript Patterns](#6-typescript-patterns)
7. [Performance Optimization](#7-performance-optimization)
8. [Styling with Tailwind CSS](#8-styling-with-tailwind-css)
9. [Testing Strategy](#9-testing-strategy)
10. [Security](#10-security)
11. [Accessibility (a11y)](#11-accessibility-a11y)
12. [Custom Hooks](#12-custom-hooks)
13. [Error Handling](#13-error-handling)
14. [API Design](#14-api-design)
15. [Caching Strategies](#15-caching-strategies)

---

## 1. Architecture Patterns

### Recommended: Feature-Sliced Design (FSD)

Feature-Sliced Design is the leading methodology for scalable frontend applications in 2025.

```
src/
├── app/                    # Application layer (routing, providers)
├── processes/              # Complex cross-page workflows (deprecated)
├── pages/                  # Full page components
├── widgets/                # Large self-contained UI blocks
├── features/               # Product features (user actions)
├── entities/               # Business entities (User, Product)
├── shared/                 # Reusable infrastructure
│   ├── ui/                 # UI kit components
│   ├── lib/                # Utilities, helpers
│   ├── api/                # API clients
│   └── config/             # Configuration
```

### Bulletproof React Structure

```
src/
├── app/              # App layer (routes, providers, router)
├── assets/           # Static files (images, fonts)
├── components/       # Shared components
├── config/           # Global configurations
├── features/         # Feature-based modules
│   └── tickets/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts  # Public API
├── hooks/            # Shared hooks
├── lib/              # Preconfigured libraries
├── stores/           # Global state stores
├── testing/          # Test utilities
└── types/            # Shared types
```

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility** | Each module/file has one purpose |
| **Colocation** | Keep related code together |
| **Low Coupling** | Features don't depend on each other |
| **High Cohesion** | Related logic stays in same module |
| **Public API** | Export only what's needed via index.ts |

---

## 2. Next.js 15 App Router

### Project Structure

```
app/
├── (marketing)/           # Route group (not in URL)
│   ├── about/
│   └── contact/
├── (dashboard)/           # Another route group
│   ├── layout.tsx
│   └── settings/
├── api/                   # API Route Handlers
│   └── tickets/
│       └── route.ts
├── layout.tsx             # Root layout
├── page.tsx               # Home page
├── loading.tsx            # Loading UI
├── error.tsx              # Error UI
├── not-found.tsx          # 404 page
└── global-error.tsx       # Global error boundary
```

### Best Practices

```typescript
// ✅ GOOD: Thin API routes (< 80 lines)
// app/api/tickets/route.ts
import { TicketService } from "@/server/services"
import { apiSuccess, handleApiError } from "@/lib/api"

const service = new TicketService()

export async function GET(request: Request) {
  try {
    const tickets = await service.getAll()
    return apiSuccess({ tickets })
  } catch (error) {
    return handleApiError(error, "GET /api/tickets")
  }
}

// ❌ BAD: Business logic in API route
export async function GET(request: Request) {
  const db = await connectDB()
  const tickets = await db.query("SELECT * FROM tickets")
  const formatted = tickets.map(t => ({ ...t, date: formatDate(t.date) }))
  // 100+ more lines of logic...
}
```

### Route Configuration

```typescript
// Static route (cached)
export const dynamic = 'force-static'
export const revalidate = 3600 // ISR: revalidate every hour

// Dynamic route (not cached)
export const dynamic = 'force-dynamic'

// Edge runtime
export const runtime = 'edge'
```

### Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.png'],
  },
}
```

---

## 3. React Server Components

### Core Concepts

```
┌─────────────────────────────────────────────────────────┐
│                    Server Components                     │
│  • Run on server only                                   │
│  • Zero bundle size impact                              │
│  • Direct database/API access                           │
│  • No useState, useEffect, onClick                      │
└─────────────────────────────────────────────────────────┘
                            │
                    "use client" boundary
                            │
┌─────────────────────────────────────────────────────────┐
│                    Client Components                     │
│  • Run on server (SSR) + client (hydration)            │
│  • Added to JS bundle                                   │
│  • useState, useEffect, event handlers                  │
│  • Browser APIs (localStorage, window)                  │
└─────────────────────────────────────────────────────────┘
```

### Pattern: Container/Presentational with RSC

```typescript
// Server Component (Container) - fetches data
// app/tickets/page.tsx
import { TicketList } from "./ticket-list"

export default async function TicketsPage() {
  const tickets = await fetch('/api/tickets').then(r => r.json())

  return <TicketList tickets={tickets} />
}

// Client Component (Presentational) - handles interaction
// app/tickets/ticket-list.tsx
"use client"

interface Props {
  tickets: Ticket[]
}

export function TicketList({ tickets }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul>
      {tickets.map(ticket => (
        <li
          key={ticket.id}
          onClick={() => setSelected(ticket.id)}
          className={selected === ticket.id ? 'selected' : ''}
        >
          {ticket.title}
        </li>
      ))}
    </ul>
  )
}
```

### Client Boundary Best Practices

```typescript
// ✅ GOOD: Push "use client" down as far as possible
// components/header.tsx (Server Component)
import { SearchBar } from "./search-bar" // This is the client boundary

export function Header() {
  return (
    <header>
      <Logo />           {/* Server Component */}
      <Navigation />     {/* Server Component */}
      <SearchBar />      {/* Client Component */}
    </header>
  )
}

// ❌ BAD: "use client" at the top of large component tree
"use client"

export function Header() {
  // Now everything inside is a Client Component
  // Even components that don't need client-side JS
}
```

### Server Actions

```typescript
// actions/ticket.actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
})

export async function createTicket(formData: FormData) {
  // Validate input
  const parsed = CreateTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Create ticket
  await db.ticket.create({ data: parsed.data })

  // Revalidate cache
  revalidatePath('/tickets')

  return { success: true }
}
```

---

## 4. Component Design

### Component Size Limits

| Type | Max Lines | Max Functions |
|------|-----------|---------------|
| Page Component | 150 | 3 |
| Feature Component | 200 | 5 |
| UI Component | 100 | 3 |
| Hook | 100 | 3 |

### Compound Components Pattern

```typescript
// ✅ GOOD: Compound components for flexible composition
// components/ui/card.tsx
import { createContext, useContext, ReactNode } from 'react'

interface CardContextValue {
  variant: 'default' | 'bordered'
}

const CardContext = createContext<CardContextValue | null>(null)

function useCard() {
  const context = useContext(CardContext)
  if (!context) throw new Error('Card components must be used within Card')
  return context
}

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'bordered'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div className={cn('rounded-lg', variant === 'bordered' && 'border')}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b">{children}</div>
}

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>
}

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="p-4 border-t bg-muted">{children}</div>
}

// Usage
<Card variant="bordered">
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Component Props Interface

```typescript
// ✅ GOOD: Clear, typed props
interface ButtonProps {
  /** Button content */
  children: ReactNode
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Click handler */
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        isLoading && 'opacity-50 cursor-wait'
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
```

---

## 5. State Management

### 2025 Recommended Stack

```
┌────────────────────────────────────────────────────────┐
│                  State Management Stack                 │
├────────────────────────────────────────────────────────┤
│  Server State    │  TanStack Query (React Query)       │
│  Client State    │  Zustand                            │
│  URL State       │  nuqs                               │
│  Form State      │  React Hook Form + Zod              │
└────────────────────────────────────────────────────────┘
```

### TanStack Query for Server State

```typescript
// hooks/use-tickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '@/lib/api'

// Query keys factory
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
}

// Fetch tickets
export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => ticketApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Fetch single ticket
export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketApi.getById(id),
    enabled: !!id,
  })
}

// Create ticket mutation
export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ticketApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() })
    },
  })
}
```

### Zustand for Client State

```typescript
// stores/ui.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  setTheme: (theme: UIState['theme']) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: 'system',
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
      }),
      { name: 'ui-store' }
    )
  )
)

// Usage in component
function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  if (!sidebarOpen) return null

  return <aside>...</aside>
}
```

### When to Use What

| State Type | Solution | Example |
|------------|----------|---------|
| Server data | TanStack Query | API responses, database data |
| Global UI | Zustand | Theme, sidebar, modals |
| URL params | nuqs / searchParams | Filters, pagination |
| Form data | React Hook Form | Form inputs |
| Local UI | useState | Dropdown open, hover state |

---

## 6. TypeScript Patterns

### Strict Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Patterns

```typescript
// ✅ Use `unknown` instead of `any`
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
  if (isTicket(data)) {
    return data.title
  }
  throw new Error('Invalid data')
}

// ✅ Type guard
function isTicket(value: unknown): value is Ticket {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  )
}

// ✅ Const assertions for literal types
const STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PENDING: 'pending',
} as const

type Status = typeof STATUS[keyof typeof STATUS]
// Result: 'open' | 'closed' | 'pending'

// ✅ Utility types
type TicketCreate = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
type TicketUpdate = Partial<Pick<Ticket, 'title' | 'description' | 'status'>>
type RequiredTicket = Required<Ticket>

// ✅ Generic components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}

// ✅ Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data) // TypeScript knows data exists
  } else {
    console.error(result.error) // TypeScript knows error exists
  }
}
```

### API Response Types

```typescript
// types/api.ts

// Base response wrapper
interface ApiResponse<T> {
  data: T
  meta?: {
    page: number
    limit: number
    total: number
  }
}

// Error response
interface ApiError {
  error: string
  code: string
  details?: Record<string, string[]>
}

// Type-safe fetch wrapper
async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options)

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new ApiRequestError(error)
  }

  return response.json()
}
```

---

## 7. Performance Optimization

### Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **INP** | < 200ms | Interaction to Next Paint |
| **CLS** | < 0.1 | Cumulative Layout Shift |

### Image Optimization

```typescript
import Image from 'next/image'

// ✅ GOOD: Next.js Image component
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority          // Above the fold - preload
  placeholder="blur"
  blurDataURL={blurUrl}
/>

// For responsive images
<Image
  src="/product.jpg"
  alt="Product"
  fill                    // Fill parent container
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic'

// Dynamic import with loading state
const HeavyComponent = dynamic(
  () => import('@/components/heavy-component'),
  {
    loading: () => <Skeleton />,
    ssr: false, // Client-only if needed
  }
)

// Named exports
const Modal = dynamic(() =>
  import('@/components/modal').then((mod) => mod.Modal)
)
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Suspense & Streaming

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* These load in parallel, stream when ready */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <Charts />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

### Memoization Guidelines

```typescript
// ✅ GOOD: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return items.filter(filterFn).sort(sortFn).map(mapFn)
}, [items])

// ✅ GOOD: Stable callback reference for child components
const handleClick = useCallback((id: string) => {
  setSelected(id)
}, [])

// ❌ BAD: Memoizing everything
const simpleValue = useMemo(() => a + b, [a, b]) // Unnecessary
const increment = useCallback(() => setCount(c => c + 1), []) // Often unnecessary
```

---

## 8. Styling with Tailwind CSS

### Organization Pattern

```typescript
// ✅ GOOD: Use clsx + tailwind-merge
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<button className={cn(
  // Base styles
  'inline-flex items-center justify-center rounded-md',
  'text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2',
  // Variant styles
  variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
  variant === 'secondary' && 'bg-secondary text-secondary-foreground',
  // Size styles
  size === 'sm' && 'h-8 px-3',
  size === 'md' && 'h-10 px-4',
  size === 'lg' && 'h-12 px-6',
  // State styles
  disabled && 'opacity-50 cursor-not-allowed',
  // Custom classes
  className
)}>
```

### CVA (Class Variance Authority)

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Atomic Design with Tailwind

```
components/
├── atoms/           # Smallest units
│   ├── button.tsx
│   ├── input.tsx
│   └── badge.tsx
├── molecules/       # Combinations of atoms
│   ├── search-bar.tsx   # input + button
│   ├── form-field.tsx   # label + input + error
│   └── avatar.tsx
├── organisms/       # Complex UI sections
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── ticket-card.tsx
└── templates/       # Page layouts
    ├── dashboard-layout.tsx
    └── auth-layout.tsx
```

---

## 9. Testing Strategy

### Testing Pyramid

```
         ┌─────────────┐
         │    E2E      │  Few (Playwright)
         │   Tests     │  User journeys
         ├─────────────┤
         │ Integration │  Some (Vitest + RTL)
         │   Tests     │  Component interactions
         ├─────────────┤
         │    Unit     │  Many (Vitest)
         │   Tests     │  Functions, hooks, utils
         └─────────────┘
```

### Vitest Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
})
```

### Component Testing

```typescript
// tests/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Hook Testing

```typescript
// tests/hooks/use-tickets.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTickets } from '@/hooks/use-tickets'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTickets', () => {
  it('fetches tickets successfully', async () => {
    const { result } = renderHook(() => useTickets({}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(3)
  })
})
```

### E2E Testing with Playwright

```typescript
// tests/e2e/tickets.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tickets', () => {
  test('user can create a ticket', async ({ page }) => {
    await page.goto('/tickets')

    // Click create button
    await page.click('button:has-text("Create Ticket")')

    // Fill form
    await page.fill('input[name="title"]', 'Test Ticket')
    await page.fill('textarea[name="description"]', 'Description')

    // Submit
    await page.click('button:has-text("Submit")')

    // Verify created
    await expect(page.locator('text=Test Ticket')).toBeVisible()
  })
})
```

---

## 10. Security

### Security Checklist

- [ ] Input validation with Zod on all Server Actions
- [ ] CSRF protection for forms
- [ ] XSS prevention (no dangerouslySetInnerHTML without sanitization)
- [ ] Secure HTTP headers configured
- [ ] Environment variables not exposed to client
- [ ] Authentication on all protected routes
- [ ] Rate limiting on API endpoints

### Server Actions Security

```typescript
// actions/create-ticket.ts
"use server"

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { ratelimit } from '@/lib/ratelimit'

const CreateTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
})

export async function createTicket(formData: FormData) {
  // 1. Authenticate
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // 2. Rate limit
  const { success } = await ratelimit.limit(session.user.id)
  if (!success) {
    throw new Error('Too many requests')
  }

  // 3. Validate input
  const parsed = CreateTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // 4. Sanitize (if needed)
  const sanitizedData = {
    ...parsed.data,
    description: parsed.data.description
      ? DOMPurify.sanitize(parsed.data.description)
      : undefined,
  }

  // 5. Create with authorization
  await db.ticket.create({
    data: {
      ...sanitizedData,
      userId: session.user.id,
    },
  })

  revalidatePath('/tickets')
  return { success: true }
}
```

### Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Server-only (no NEXT_PUBLIC_ prefix)
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JIRA_API_TOKEN: z.string(),

  // Client-safe (NEXT_PUBLIC_ prefix)
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

// Validate at build time
export const env = envSchema.parse(process.env)

// ❌ NEVER expose server secrets to client
// Don't use process.env.JWT_SECRET in client components
```

---

## 11. Accessibility (a11y)

### Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] ARIA attributes where needed
- [ ] Skip links for navigation

### Accessible Components

```typescript
// ✅ GOOD: Accessible button
<button
  aria-label="Close modal"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
  onClick={handleClick}
>
  <XIcon aria-hidden="true" />
</button>

// ✅ GOOD: Accessible form
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="email">Email address</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? 'email-error' : undefined}
    />
    {errors.email && (
      <p id="email-error" role="alert">
        {errors.email}
      </p>
    )}
  </div>
</form>

// ✅ GOOD: Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to proceed?</p>
</div>
```

### Focus Management

```typescript
// hooks/use-focus-trap.ts
import { useEffect, useRef } from 'react'

export function useFocusTrap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element on mount
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [])

  return containerRef
}
```

---

## 12. Custom Hooks

### Best Practices

```typescript
// ✅ GOOD: Single responsibility
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// ✅ GOOD: Composed hooks
function useModal() {
  const { value: isOpen, setTrue: open, setFalse: close } = useToggle()
  const focusTrapRef = useFocusTrap()

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  return { isOpen, open, close, focusTrapRef }
}
```

### Hook Patterns

```typescript
// Pattern: Data fetching hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await fetch(url, { signal: controller.signal })
        const json = await response.json()
        setData(json)
        setError(null)
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          setError(e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [url])

  return { data, error, isLoading }
}

// Pattern: Local storage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Pattern: Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

## 13. Error Handling

### Error Boundary Strategy

```
app/
├── global-error.tsx      # Root error boundary
├── error.tsx             # App-level errors
└── dashboard/
    ├── error.tsx         # Route-level errors
    └── page.tsx
```

### Implementation

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

### Component-Level Error Boundaries

```typescript
// components/error-boundary.tsx
'use client'

import { ErrorBoundary } from 'react-error-boundary'

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 border border-destructive rounded-lg">
      <h3 className="font-medium text-destructive">Error loading component</h3>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={resetErrorBoundary} className="mt-2 text-sm underline">
        Try again
      </button>
    </div>
  )
}

// Usage
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => queryClient.clear()}
  onError={(error) => logError(error)}
>
  <RiskyComponent />
</ErrorBoundary>
```

### Async Error Handling

```typescript
// With TanStack Query - throw errors to boundary
const { data } = useQuery({
  queryKey: ['tickets'],
  queryFn: fetchTickets,
  throwOnError: true, // Errors bubble to ErrorBoundary
})

// Or handle inline
const { data, error, isError } = useQuery({
  queryKey: ['tickets'],
  queryFn: fetchTickets,
})

if (isError) {
  return <ErrorMessage error={error} />
}
```

---

## 14. API Design

### Route Handler Pattern

```typescript
// app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TicketService } from '@/server/services'
import { auth } from '@/lib/auth'

const service = new TicketService()

// GET /api/tickets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await service.getAll({ page, limit, userId: session.user.id })

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/tickets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tickets
const CreateTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = CreateTicketSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const ticket = await service.create({
      ...parsed.data,
      userId: session.user.id,
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('POST /api/tickets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### API Response Standards

```typescript
// lib/api/responses.ts
import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, success: true }, { status })
}

export function apiError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    { error: message, success: false, details },
    { status }
  )
}

export function badRequest(message: string, details?: unknown) {
  return apiError(message, 400, details)
}

export function unauthorized(message = 'Unauthorized') {
  return apiError(message, 401)
}

export function notFound(message = 'Not found') {
  return apiError(message, 404)
}
```

---

## 15. Caching Strategies

### Next.js Caching Layers

| Layer | Purpose | Default |
|-------|---------|---------|
| Request Memoization | Dedupe fetch in same render | Automatic |
| Data Cache | Store fetch results | Opt-in |
| Full Route Cache | Cache rendered HTML | Static routes |
| Router Cache | Client-side cache | Automatic |

### ISR (Incremental Static Regeneration)

```typescript
// Time-based revalidation
// app/tickets/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function TicketsPage() {
  const tickets = await getTickets() // Cached for 1 hour
  return <TicketList tickets={tickets} />
}
```

### On-Demand Revalidation

```typescript
// app/api/webhooks/ticket-updated/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { ticketId } = await request.json()

  // Revalidate specific paths
  revalidatePath('/tickets')
  revalidatePath(`/tickets/${ticketId}`)

  // Or use tags for more granular control
  revalidateTag('tickets')
  revalidateTag(`ticket-${ticketId}`)

  return Response.json({ revalidated: true })
}
```

### Tagged Caching

```typescript
// lib/data/tickets.ts
import { unstable_cache } from 'next/cache'

export const getTickets = unstable_cache(
  async (userId: string) => {
    return db.ticket.findMany({ where: { userId } })
  },
  ['tickets'],
  {
    tags: ['tickets'],
    revalidate: 3600, // 1 hour fallback
  }
)

export const getTicket = unstable_cache(
  async (id: string) => {
    return db.ticket.findUnique({ where: { id } })
  },
  ['ticket'],
  {
    tags: ['tickets', `ticket-${id}`],
    revalidate: 3600,
  }
)
```

---

## Quick Reference

### File Size Limits

| Type | Max Lines |
|------|-----------|
| API Route | 80 |
| Service | 250 |
| Component | 200 |
| Hook | 100 |
| Function | 30 |

### Import Order

```typescript
// 1. React/Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External packages
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Internal (@/)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 4. Relative
import { TicketCard } from './ticket-card'
import type { TicketProps } from './types'
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `TicketCard.tsx` |
| Hook | camelCase with use | `useTickets.ts` |
| Utility | camelCase | `formatDate.ts` |
| Type/Interface | PascalCase | `Ticket`, `TicketProps` |
| Constant | SCREAMING_SNAKE | `MAX_ITEMS`, `API_URL` |

---

## Sources & References

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

### Architecture
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Patterns](https://www.patterns.dev/react)

### Best Practices Articles
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)
- [React Server Components Guide](https://www.joshwcomeau.com/react/server-components/)
- [State Management 2025](https://www.developerway.com/posts/react-state-management-2025)
- [Core Web Vitals Optimization](https://makersden.io/blog/optimize-web-vitals-in-nextjs-2025)
- [TypeScript Best Practices 2025](https://blogs.perficient.com/2025/03/05/using-typescript-with-react-best-practices/)
- [React Hooks Patterns 2025](https://dev.to/tahamjp/advanced-react-hooks-in-2025-patterns-you-should-know-2e4n)
- [Next.js Security Guide](https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices)

---

*Last updated: December 2025*
