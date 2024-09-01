import { test, expect } from '@playwright/test';

test('should add a new habit', async ({ page }) => {
  const today = new Date().toISOString().split('T')[0];
  await page.goto(`http://localhost:5173/habitracker/day/${today}`);

  const addHabitButton = page.getByRole('button', { name: 'Add Habit' });
  await expect(addHabitButton).toBeVisible();

  await addHabitButton.click();

  const habitDialog = page.getByRole('dialog');
  await expect(habitDialog).toBeVisible();

  const habitNameInput = page.getByLabel('Habit Name');
  await expect(habitNameInput).toBeVisible();
  await habitNameInput.fill('Test habit');

  const addButton = habitDialog.getByRole('button', { name: 'Add' });
  await expect(addButton).toBeEnabled();
  await addButton.click();

  await expect(habitDialog).not.toBeVisible();
  await expect(page.getByText('Test habit')).toBeVisible();
});


test('should add a new category and assign it to a habit', async ({ page }) => {
  const today = new Date().toISOString().split('T')[0];
  await page.goto(`http://localhost:5173/habitracker/day/${today}`);

  await page.getByRole('button', { name: 'Categories' }).click();
  await page.getByLabel('New Category Name').fill('Health');
  await page.getByRole('button', { name: 'Add Category' }).click();

  await page.getByRole('button', { name: 'Add Habit' }).click();

  await page.getByLabel('Habit Name').fill('Test habit');
  
  await page.locator('div:nth-child(2) > .v-input__control > .v-field > .v-field__field > .v-field__input').click();
  await page.getByText('Health').click();

  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(page.getByText('Test habit')).toBeVisible();
  await expect(page.getByText('Health')).toBeVisible();
});
