# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> admin can login and view dashboard
- Location: tests\login.spec.ts:3:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
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
  3  | test('admin can login and view dashboard', async ({ page }) => {
  4  |   // Navigate to root, should redirect to login if not authenticated
  5  |   await page.goto('/');
  6  | 
  7  |   // Expect the URL to contain /login
  8  |   await expect(page).toHaveURL(/.*\/login/);
  9  | 
  10 |   // Fill in email and password
  11 |   await page.fill('input[type="email"]', 'test2user@pos.com');
  12 |   await page.fill('input[type="password"]', 'password123');
  13 | 
  14 |   // Click Sign In
  15 |   await page.click('button:has-text("Sign in")');
  16 | 
  17 |   // Should redirect to dashboard
> 18 |   await expect(page).toHaveURL('http://localhost:3000/');
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  19 | 
  20 |   // Verify dashboard elements are visible (using a heading or navigation element)
  21 |   await expect(page.locator('text=POS System').first()).toBeVisible();
  22 | });
  23 | 
```