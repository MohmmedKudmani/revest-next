# Code Standards

## General

- No business logic inside components — data fetching lives in `lib/api.ts`
- No `fetch` inside Client Components — data comes from Server Components as props
- No `useEffect` for data fetching — Server Components handle all fetching
- Prefer explicit names over clever abstractions

## TypeScript

- Strict mode throughout
- No `any` — use types inferred from Zod schemas
- All API helper functions have explicit return types

## Schemas

One file per feature in `src/schemas/`. Defines the shape of data coming back from the API — used for type safety only (no runtime validation needed on GET responses).

```typescript
// schemas/product.schema.ts
import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Product = z.infer<typeof ProductSchema>
```

```typescript
// schemas/order.schema.ts
import { z } from 'zod'
import { ProductSchema } from './product.schema'

export const OrderSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  totalPrice: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  createdAt: z.string(),
  updatedAt: z.string(),
  product: ProductSchema.nullable(), // enriched by order-service
})

export type Order = z.infer<typeof OrderSchema>
```

## Server Components

- `page.tsx` is always a Server Component — no `'use client'`
- Fetch all data at the page level using `Promise.all` for parallel requests
- Pass data down as props — never fetch inside a child component

## Client Components

- Only use `'use client'` when interactivity is actually needed
- `useState` for local UI state only — not for data
- UI decisions are deferred — do not hard-code layout or design patterns

## API Helpers

All fetch calls live in `lib/api.ts`. Never inline fetch in a page or component.

- Always type the return value
- Always check `res.ok` and throw on failure
- Always attach a `next: { tags: [] }` cache tag

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| API helper | `getFeature` | `getProducts()` |
| Schema | `FeatureSchema` | `ProductSchema` |
| Type | `PascalCase` | `Product`, `Order` |
| Component | `kebab-case.tsx` | `products-view.tsx` |
| Cache tag | lowercase string | `'products'`, `'orders'` |
