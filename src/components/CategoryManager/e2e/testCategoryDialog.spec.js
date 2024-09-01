import { test, expect } from '@playwright/test';

test('should find and open the Categories dialog', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('button:has-text("Categories")');
  const dialog = page.locator('.v-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Manage Categories');
});

test('should add a new category', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('button:has-text("Categories")');
  const dialog = page.locator('.v-dialog');
  await dialog.locator('.v-text-field input').fill('Test Category');
  await dialog.locator('.icon-btn').first().click();
  await dialog.locator('button:has-text("Add Category")').click();
  await page.click('button:has-text("Categories")');
  await expect(dialog.locator('.v-list-item-title:has-text("Test Category")')).toBeVisible();
  await dialog.locator('button:has-text("Close")').click();
});

test('should delete a category', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('button:has-text("Categories")');
  const dialog = page.locator('.v-dialog');
  const categoryName = 'Test Category';

  const existingCategory = dialog.locator(`.v-list-item:has-text("${categoryName}")`);
  if (await existingCategory.count() === 0) {
    await dialog.locator('.v-text-field input').fill(categoryName);
    await dialog.locator('.icon-btn').first().click();
    await dialog.locator('button:has-text("Add Category")').click();
    await page.click('button:has-text("Categories")');
  }

  const categoryItem = dialog.locator(`.v-list-item:has-text("${categoryName}")`);
  await categoryItem.locator('button').last().click();
  await expect(dialog.locator(`.v-list-item:has-text("${categoryName}")`)).not.toBeVisible();
  await dialog.locator('button:has-text("Close")').click();
  await page.click('button:has-text("Categories")');
  await expect(dialog.locator(`.v-list-item:has-text("${categoryName}")`)).not.toBeVisible();
  await dialog.locator('button:has-text("Close")').click();
});
