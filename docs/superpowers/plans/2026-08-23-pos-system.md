# POS System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack Point of Sale (POS) and Inventory Dashboard for a women's accessories store. The system will manage inventory, process sales, track expenses, and display analytics.

**Architecture:** 
- **Framework:** Next.js (App Router) for both frontend and backend (Server Actions / API Routes).
- **Database:** PostgreSQL (Neon) accessed via Prisma.
- **Auth:** BetterAuth integrated directly into Next.js.

**Global Constraints:**
- Use **pnpm** as the package manager.
- Stack is fixed: Next.js + Tailwind + shadcn/ui + Prisma + PostgreSQL + BetterAuth.
- All configuration via environment variables.
- Write clean, modular code using Next.js Server Actions and standard project structure.

---

## Phase 1: Foundation & Authentication

**Goal:** Set up the Next.js project, initialize Prisma, and configure BetterAuth.

- [ ] **Step 1.1: Project Initialization**
  - Initialize Next.js app (`npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`).
  - Initialize shadcn/ui (`npx shadcn@latest init`).
  - Install dependencies: `better-auth`, `@prisma/client`, `zod`, `zustand`, `@tanstack/react-query`, `lucide-react`.
  - Install dev dependencies: `prisma`.

- [ ] **Step 1.2: Prisma Schema & Database setup**
  - Initialize Prisma (`npx prisma init`).
  - Create `prisma/schema.prisma` using the schema defined in `PROJECT_SPECS.md`.
  - Include the required BetterAuth models (`user`, `session`, `account`, `verification`).
  - Create a global Prisma client instance in `src/lib/prisma.ts`.

- [ ] **Step 1.3: BetterAuth Integration**
  - Configure BetterAuth in `src/lib/auth.ts` with the Prisma adapter.
  - Create the API route catch-all at `src/app/api/auth/[...all]/route.ts`.
  - Create the BetterAuth client in `src/lib/auth-client.ts`.

- [ ] **Step 1.4: Authentication UI & Protection**
  - Build a `/login` page using shadcn/ui components.
  - Implement middleware or layout checks to protect routes, ensuring only authenticated users can access the dashboard.

---

## Phase 2: Inventory Management

**Goal:** Allow users to manage the products they sell.

- [ ] **Step 2.1: Products Server Actions**
  - Create `src/actions/products.ts`.
  - Implement server actions for CRUD operations on products (create, update, delete, get all).
  - Ensure operations check for active sessions for security.

- [ ] **Step 2.2: Inventory UI**
  - Create an `/inventory` page.
  - Use shadcn/ui `Table` or Data Tables to display products.
  - Create a "New Product" modal/dialog using shadcn `Dialog` and `react-hook-form` with `zod` for creating and editing products.

---

## Phase 3: Core POS Interface & Sales Ledger

**Goal:** Provide a fast checkout interface to record sales and deduct inventory.

- [ ] **Step 3.1: Sales Server Actions**
  - Create `src/actions/sales.ts`.
  - Implement action to create a sale.
  - Logic: Use Prisma `$transaction` to create the `Sale` record AND decrement the `Product.stock` by the sold quantity simultaneously. If stock is insufficient, throw an error.

- [ ] **Step 3.2: POS UI**
  - Create the main `/pos` page.
  - Left side: A list of products or a searchable combobox to select an item.
  - Right side: A "Cart" or "Checkout" summary showing selected product, quantity input, total price calculation.
  - Payment Method selector (Zaad, eDahab, Cash) and Customer Name input.
  - Submit button that triggers the server action and clears the form upon success.

---

## Phase 4: Expenses & Analytics Dashboard

**Goal:** Track money going out and show the overall business health.

- [ ] **Step 4.1: Expenses Logic & UI**
  - Create `src/actions/expenses.ts`.
  - Create `/expenses` page with a table and a "Log Expense" dialog.

- [ ] **Step 4.2: Analytics Actions**
  - Create `src/actions/analytics.ts`.
  - Aggregate logic: `totalSalesAmount`, `totalExpensesAmount`, `netProfit` = Sales - Expenses for today/month.

- [ ] **Step 4.3: Dashboard UI**
  - Create the `/` (Home) dashboard view.
  - Display KPI cards (Total Sales, Total Expenses, Net Profit) using shadcn/ui `Card`.
  - Show a "Recent Transactions" table combining the latest sales and expenses.

---
**Final Verification:** 
- Run the app (`pnpm dev`).
- Verify end-to-end flow: Login -> Add Product -> Make Sale -> View Dashboard.
