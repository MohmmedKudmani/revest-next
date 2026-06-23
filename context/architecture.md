# Architecture

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          ← root layout
│   └── page.tsx            ← single page, Server Component, fetches + renders
├── components/
│   ├── products-view.tsx   ← Client Component, renders products data
│   └── orders-view.tsx     ← Client Component, renders orders data
├── schemas/
│   ├── product.schema.ts   ← Zod types for Product
│   └── order.schema.ts     ← Zod types for Order
└── lib/
    └── api.ts              ← fetch helpers (used in Server Components only)
```

---

## Data Flow

```
app/page.tsx (Server Component)
  → lib/api.ts getProducts() + getOrders()
  → fetches from both NestJS services
  → passes data as props to Client Components
```

No mutations, no actions, no cache busting needed yet.

---

## Server Component Pattern

```typescript
// app/page.tsx
import { getProducts, getOrders } from '@/lib/api'

export default async function Page() {
  const [products, orders] = await Promise.all([
    getProducts(),
    getOrders(),
  ])

  return (
    <>
      <ProductsView products={products} />
      <OrdersView orders={orders} />
    </>
  )
}
```

---

## Fetch + Cache Pattern

```typescript
// lib/api.ts
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.PRODUCT_SERVICE_URL}/products`, {
    next: { tags: ['products'] },
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${process.env.ORDER_SERVICE_URL}/orders`, {
    next: { tags: ['orders'] },
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}
```

---

## Environment Variables

```env
# .env.local
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
```

Server-only — no `NEXT_PUBLIC_` prefix. Only used in Server Components and `lib/api.ts`, never in client-side code.
