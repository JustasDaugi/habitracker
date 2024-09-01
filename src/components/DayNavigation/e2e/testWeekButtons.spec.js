import { test, expect } from '@playwright/test';

test('left chevron button updates to previous week', async ({ page }) => {
  const today = new Date().toISOString().split('T')[0];
  await page.goto(`http://localhost:5173/habitracker/day/2024-08-22/${today}`);
  await page.evaluate(() => {
    window.lastNavigateWeekEvent = null;
    document.addEventListener('navigate-week', (event) => {
      window.lastNavigateWeekEvent = event.detail;
    });
  });
  await page.locator('.week-navigation > button:first-child').click();

  const direction = await page.evaluate(() => window.lastNavigateWeekEvent);
  expect(direction).toBe(-1);
});

test('right chevron button shows future date message when navigating one week ahead of the current one', async ({ page }) => {
  const today = new Date().toISOString().split('T')[0];
  await page.goto(`http://localhost:5173/habitracker/day/${today}`);

  await page.locator('.week-navigation > button:last-child').click();

  // Assuming the snackbar is implemented in a parent component
  const snackbar = page.locator('.v-snackbar');
  await expect(snackbar).toBeVisible({ timeout: 5000 });

  const snackbarText = await snackbar.textContent();
  expect(snackbarText).toContain('Cannot navigate to future dates.');
});
