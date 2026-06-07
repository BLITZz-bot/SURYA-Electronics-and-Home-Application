# SURYA Electronics and Home appliances

A complete small-scale ecommerce store scaffold built with Next.js, Google authentication, Prisma, and Tailwind CSS.

## What is included

- `Next.js` App Router frontend
- Google sign-in with `next-auth`
- `Prisma` schema for users, products, cart, orders, and admin
- Product catalog and product detail pages
- Cart and COD checkout flow
- Order history and order tracking
- Admin product management and order status updates

## Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAILS` (comma-separated admin login emails)

3. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Run Prisma migration and generate the client:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Seed the initial data:

   ```bash
   npm run seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

## Google OAuth

Set your Google OAuth callback URL to:

```bash
http://localhost:3000/api/auth/callback/google
```

## Features

- Google-only registration/login
- Product browsing and detail pages
- Add-to-cart and cart management
- Cash on Delivery checkout
- View order history
- Admin product CRUD and order status updates

## Next steps

- Add Razorpay or another payment gateway
- Add multiple product images and variants
- Add wishlist or coupon support
- Add seller dashboard and invoicing
