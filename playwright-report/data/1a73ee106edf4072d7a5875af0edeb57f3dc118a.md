# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos.spec.ts >> POS & Inventory Operations >> can add a product to cart and checkout in POS
- Location: tests\pos.spec.ts:24:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/login"

```

```yaml
- main:
  - text: Login Enter your email below to login to your account. Email
  - textbox "Email":
    - /placeholder: m@example.com
    - text: test2user@pos.com
  - text: Password
  - textbox "Password": password123
  - text: Invalid email or password
  - button "Sign in"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Helper function to login before each test
  4  | test.beforeEach(async ({ page }) => {
  5  |   await page.goto('/login');
  6  |   await page.fill('input[type="email"]', 'test2user@pos.com');
  7  |   await page.fill('input[type="password"]', 'password123');
  8  |   await page.click('button:has-text("Sign in")');
> 9  |   await expect(page).toHaveURL('http://localhost:3000/');
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  10 | });
  11 | 
  12 | test.describe('POS & Inventory Operations', () => {
  13 | 
  14 |   test('can navigate to inventory and see seeded products', async ({ page }) => {
  15 |     // Navigate to Inventory page
  16 |     await page.click('a:has-text("Inventory")');
  17 |     await expect(page).toHaveURL(/.*\/inventory/);
  18 | 
  19 |     // Should see seeded products in the table
  20 |     await expect(page.locator('text=Shaamboo Cad')).toBeVisible();
  21 |     await expect(page.locator('text=Saabuun Dettol')).toBeVisible();
  22 |   });
  23 | 
  24 |   test('can add a product to cart and checkout in POS', async ({ page }) => {
  25 |     // Navigate to POS page
  26 |     await page.click('a:has-text("POS")');
  27 |     await expect(page).toHaveURL(/.*\/pos/);
  28 | 
  29 |     // Search for a product (assuming there is an input for search)
  30 |     // We will just click the product directly if it's visible, or click an "Add" button
  31 |     // This depends on the exact UI, but let's assume there is a product card/button with the text "Shaamboo Cad"
  32 |     const productButton = page.locator('div:has-text("Shaamboo Cad")').last();
  33 |     await productButton.click();
  34 | 
  35 |     // Verify product is in the cart
  36 |     await expect(page.locator('text=Total')).toBeVisible();
  37 | 
  38 |     // Proceed to checkout (assuming a checkout button)
  39 |     const checkoutBtn = page.locator('button:has-text("Checkout")');
  40 |     if (await checkoutBtn.isVisible()) {
  41 |         await checkoutBtn.click();
  42 |         
  43 |         // Confirm payment method if any modal pops up, e.g., Zaad
  44 |         const zaadBtn = page.locator('button:has-text("Zaad")');
  45 |         if (await zaadBtn.isVisible()) {
  46 |             await zaadBtn.click();
  47 |         }
  48 | 
  49 |         // Verify successful checkout (e.g. success toast or empty cart)
  50 |         await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 }).catch(() => {});
  51 |     }
  52 |   });
  53 | });
  54 | 
```