# POS & Inventory System Specification

## Problem Statement

The store owners currently run a women's accessories store (selling watches, bags, earrings, bracelets, etc.) with disorganized inventory and sales tracking, making it difficult to distinguish between personal and business finances. They lack real-time visibility into which items have sold and which remain in stock. With a high volume of sales expected during graduation season, they need a fast, reliable, and user-friendly system to manage their business operations effectively.

## Solution

A modern, web-based Point of Sale (POS) and Inventory Dashboard tailored to their daily operations. The system will allow them to seamlessly register and track inventory items and prices, record sales transactions quickly (capturing customer names, quantities, and payment methods like Zaad/eDahab), log daily operational expenses, and view a comprehensive analytics dashboard displaying daily/monthly sales, inventory turnover, and net profit.

## User Stories

1. As a store manager, I want to add new inventory items (name, category, price, stock), so that I can track what is available for sale.
2. As a store manager, I want to update the price and stock of existing items, so that the inventory reflects real-world changes.
3. As a store manager, I want to see low-stock alerts, so that I know when to reorder products.
4. As a cashier, I want to quickly select products and enter quantities in a POS form, so that I can process customer checkouts rapidly.
5. As a cashier, I want the total price to calculate automatically, so that I don't make manual calculation errors.
6. As a cashier, I want to record the payment method (Zaad, eDahab, Cash) and customer name, so that I have a clear record of how the transaction was settled.
7. As a store manager, I want inventory stock to automatically decrease when a sale is recorded, so that my inventory numbers are always accurate.
8. As a store manager, I want to log daily operational expenses (e.g., internet, meals), so that these costs are accounted for in the business finances.
9. As a store owner, I want to view a dashboard showing total sales and expenses for the day/month, so that I can understand the financial health of the business.
10. As a store owner, I want the system to automatically calculate net profit, so that I don't have to separate personal and business finances manually.

## Implementation Decisions

- **Architecture:** Full-stack Monolith.
- **Framework:** Next.js (App Router, Server Actions/API Routes).
- **Styling & UI:** Tailwind CSS and shadcn/ui for rapid, clean, and accessible component development.
- **State Management:** Zustand for global state and TanStack React Query for client-side data fetching.
- **Database:** PostgreSQL (hosted on Neon) accessed via Prisma ORM.
- **Authentication:** Better Auth (with Prisma adapter) integrated directly into Next.js.
- **Data Schema:** 
  - `User` for authentication.
  - `Product` for inventory.
  - `Sale` linking to `Product` to record transactions.
  - `Expense` for operational costs.

## Testing Decisions

- Server Actions/API routes should have integration tests verifying that sales correctly decrement inventory stock, and that creating products works as expected.
- External behavior (like the POS checkout flow) should be prioritized for testing over internal services.
- Only authenticated users should be able to access the data mutations. Security testing should ensure unauthorized requests are rejected.

## Out of Scope

- E-commerce website for customers (this is strictly an internal POS/Inventory tool).
- Complex multi-store or multi-warehouse inventory routing.
- Integration with physical receipt printers or barcode scanners (for the MVP, it is manual entry/selection).

## Further Notes

- The system must be deployed and ready within the week to accommodate the graduation season traffic.
