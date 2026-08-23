# Adeeg Zone POS System

A modern, fast, and secure Point of Sale (POS) system built with Next.js, Tailwind CSS, Prisma, and PostgreSQL. Designed for retail and small businesses to manage inventory, process sales, and track expenses effortlessly.

## 🚀 Features

- **Dashboard:** Real-time overview of sales, expenses, and net profit.
- **Multi-User Auth:** Secure authentication powered by Better Auth, with Admin and Standard User roles.
- **Point of Sale (POS):** Fast checkout interface with product search and category filtering.
- **Inventory Management:** Full CRUD operations for products, including low-stock indicators and CSV importing.
- **Sales History:** Detailed logs of all transactions with receipt printing and CSV export.
- **Expense Tracking:** Log and categorize daily operational expenses.
- **Reporting:** Visual charts and metrics for revenue, top products, and cashier performance.
- **Dark/Light Mode:** Full theming support via `next-themes`.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Neon/Supabase)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or Bun (Recommended)
- PostgreSQL Database (Local or Cloud)

### 1. Clone the repository
```bash
git clone https://github.com/sirrryasir/pos.git
cd pos
```

### 2. Install dependencies
```bash
bun install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your connection string and auth keys:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db?schema=public"
BETTER_AUTH_SECRET="your-super-secret-key"
```

### 4. Database Setup & Seeding
Push the Prisma schema to your database and seed it with initial data (including the default Admin account):
```bash
npx prisma db push
bun run prisma/seed.ts
```

*Default Admin Account:*
- **Email:** admin@pos.com
- **Password:** password123

### 5. Start the Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to access the system.

## 📝 Usage Guide
- **Login:** Use the default admin account to log in.
- **Manage Users:** Navigate to `Management > Users` to elevate new accounts to `admin` status.
- **Import Inventory:** Go to Inventory, click "Import CSV", and upload a list of products.
- **Checkout:** Use the POS page to process sales quickly.

## 📄 License
This project is proprietary and confidential.
