import { test, expect } from '@playwright/test';

test('admin can login and view dashboard', async ({ page }) => {
  // Navigate to root, should redirect to login if not authenticated
  await page.goto('/');

  // Expect the URL to contain /login
  await expect(page).toHaveURL(/.*\/login/);

  // Fill in email and password
  await page.fill('input[type="email"]', 'test2user@pos.com');
  await page.fill('input[type="password"]', 'password123');

  // Click Sign In
  await page.click('button:has-text("Sign in")');

  // Should redirect to dashboard
  await expect(page).toHaveURL('http://localhost:3000/');

  // Verify dashboard elements are visible (using a heading or navigation element)
  await expect(page.locator('text=POS System').first()).toBeVisible();
});
