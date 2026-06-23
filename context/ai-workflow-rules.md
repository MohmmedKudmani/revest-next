# AI Workflow Rules

## Approach

Build incrementally. Get data flowing before touching UI.

## Package Manager

Use `npm`. Do not use `pnpm` or `yarn`.

## Implementation Order

1. Setup — create Next.js project, install dependencies, set `.env.local`
2. Schemas — `product.schema.ts` and `order.schema.ts`
3. API helpers — `lib/api.ts` with `getProducts()` and `getOrders()`
4. Page — `app/page.tsx` fetching both, passing to placeholder components
5. Components — `products-view.tsx` and `orders-view.tsx` (UI decided later)
6. Update `progress-tracker.md`

## Decisions Already Made

Do not revisit unless explicitly asked:

- App Router only — not Pages Router
- Server Components for all data fetching — no `useEffect`, no react-query
- No Server Actions yet — view only for now
- No `NEXT_PUBLIC_` env vars — service URLs are server-only
- UI and layout decisions are deferred — do not impose structure

## Before Moving On

1. `npm run dev` starts without errors
2. Page loads and both datasets render without crashing
3. No TypeScript errors
4. `progress-tracker.md` updated
