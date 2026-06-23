# Project Overview

## What This Is

A minimal Next.js frontend for the Revest assignment. One page that displays products and orders fetched from the two NestJS backend services.

## What It Does

One page (`/`) — shows all products and all orders side by side or together. No add forms, no dialogs, no mutations for now. View only.

## What It Connects To

| Service         | URL                     | Used for                                       |
| --------------- | ----------------------- | ---------------------------------------------- |
| Product Service | `http://localhost:3001` | GET all products                               |
| Order Service   | `http://localhost:3002` | GET all orders (enriched with product details) |

## Tech Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js 14+ App Router                         |
| Language      | TypeScript                                     |
| Styling       | Tailwind CSS                                   |
| UI Components | Shadcn/ui                                      |
| Validation    | Zod                                            |
| Data fetching | Server Components + `fetch` with Next.js cache |
| Client state  | `useState` only — no state library             |
| Auth          | None                                           |

## Out of Scope (for now)

- Any mutations (create, update, delete)
- Server Actions
- Auth
- Multiple pages
- UI decisions — layout and design decided later
