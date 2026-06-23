# revest-next

Next.js frontend for the Revest test project. It displays products and orders from two local backend services.

## Setup

1. Create a `.env.local` file in the project root.

2. Add the backend service URLs:

```env
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
```

3. Start the app:

```bash
pnpm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
pnpm run dev
```

Runs the app in development mode.

```bash
pnpm run build
```

Builds the app for production.

```bash
pnpm run start
```

Starts the production server. Run `pnpm run build` first if no production build exists.

```bash
pnpm run lint
```

Runs ESLint.

```bash
pnpm run format
```

Formats the project with Prettier.

```bash
pnpm run format:check
```

Checks formatting without writing changes.
