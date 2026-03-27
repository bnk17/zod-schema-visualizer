import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

// Selectors
const FIELD_NAME_INPUT = '[aria-label="Field name"]';
const TYPE_BUTTON = '[aria-haspopup="listbox"]';
const ENUM_OPTION = '[role="option"]:has-text("enum")';
const ENUM_INPUT = '[aria-label="Add enum value"]';

test.describe('EnumValuesEditor – full user flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    // Ensure we are in Builder mode (default)
    await expect(page.getByRole('button', { name: 'Builder' })).toBeVisible();
  });

  test('selecting enum type auto-focuses the enum input', async ({ page }) => {
    // Click the type button on the first field row
    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    await expect(page.locator(ENUM_INPUT)).toBeFocused();
  });

  test('type a value + Enter → chip appears, input clears', async ({ page }) => {
    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    const input = page.locator(ENUM_INPUT);
    await input.type('admin');
    await input.press('Enter');

    await expect(page.getByRole('button', { name: /remove admin/i })).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('type a value + comma → chip appears', async ({ page }) => {
    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    const input = page.locator(ENUM_INPUT);
    await input.type('editor,');

    await expect(page.getByRole('button', { name: /remove editor/i })).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('Backspace removes last chip', async ({ page }) => {
    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    const input = page.locator(ENUM_INPUT);
    await input.type('admin');
    await input.press('Enter');
    await input.type('editor');
    await input.press('Enter');

    // Both chips present
    await expect(page.getByRole('button', { name: /remove admin/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /remove editor/i })).toBeVisible();

    await input.press('Backspace');

    await expect(page.getByRole('button', { name: /remove editor/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /remove admin/i })).toBeVisible();
  });

  test('click × removes a chip', async ({ page }) => {
    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    const input = page.locator(ENUM_INPUT);
    await input.type('admin');
    await input.press('Enter');
    await input.type('editor');
    await input.press('Enter');

    await page.getByRole('button', { name: /remove admin/i }).click();

    await expect(page.getByRole('button', { name: /remove admin/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /remove editor/i })).toBeVisible();
  });

  test('form preview select shows real enum values instead of placeholder options', async ({ page }) => {
    // Name the field first so the schema is valid
    await page.locator(FIELD_NAME_INPUT).first().fill('role');

    await page.locator(TYPE_BUTTON).first().click();
    await page.locator(ENUM_OPTION).click();

    const input = page.locator(ENUM_INPUT);
    await input.type('admin');
    await input.press('Enter');
    await input.type('viewer');
    await input.press('Enter');

    // The form preview combobox should contain the real values
    const select = page.getByRole('combobox', { name: /role/i });
    await expect(select).toBeVisible();
    // options inside a collapsed <select> are attached to the DOM but not
    // "visible" in the paint sense — use toBeAttached instead
    await expect(select.getByRole('option', { name: 'admin' })).toBeAttached();
    await expect(select.getByRole('option', { name: 'viewer' })).toBeAttached();

    // Placeholder values should NOT be present
    await expect(select.getByRole('option', { name: 'option1' })).not.toBeAttached();
    await expect(select.getByRole('option', { name: 'option2' })).not.toBeAttached();
  });
});
