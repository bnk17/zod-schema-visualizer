import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test.describe('Page load', () => {
  test('renders the hero heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /live zod schema visualizer/i })
    ).toBeVisible();
  });

  test('shows the availability badge', async ({ page }) => {
    await expect(
      page.getByText(/available for a frontend role/i)
    ).toBeVisible();
  });

  test('Visualize button is disabled on load', async ({ page }) => {
    await page.getByRole('button', { name: /paste schema/i }).click();
    await expect(
      page.getByRole('button', { name: /visualize/i })
    ).toBeDisabled();
  });
});

test.describe('Preset selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: /paste schema/i }).click();
  });

  test('loads a preset schema into the textarea when a chip is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'User Profile' }).click();
    const textarea = page.getByRole('textbox', { name: /zod schema input/i });
    await expect(textarea).toContainText('z.object');
    await expect(textarea).toContainText('email');
  });

  test('auto-visualizes the form after selecting a preset', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'User Profile' }).click();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('renders the correct field count badge for User Profile', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'User Profile' }).click();
    await expect(page.getByText('5 fields')).toBeVisible();
  });

  test('Bank Transfer preset renders currency select', async ({ page }) => {
    await page.getByRole('button', { name: 'Bank Transfer' }).click();
    await expect(
      page.getByRole('combobox', { name: /currency/i })
    ).toBeVisible();
  });

  test('NASA Asteroid preset renders isPotentiallyHazardous toggle', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'NASA Asteroid' }).click();
    await expect(
      page.getByRole('switch', { name: /potentially hazardous/i })
    ).toBeVisible();
  });
});

test.describe('Manual schema input', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: /paste schema/i }).click();
  });

  test('Visualize button enables after typing a schema', async ({ page }) => {
    await page
      .getByRole('textbox', { name: /zod schema input/i })
      .fill('z.object({ title: z.string() })');
    await expect(
      page.getByRole('button', { name: /visualize/i })
    ).toBeEnabled();
  });

  test('clicking Visualize renders the form', async ({ page }) => {
    await page
      .getByRole('textbox', { name: /zod schema input/i })
      .fill('z.object({ title: z.string() })');
    await page.getByRole('button', { name: /visualize/i }).click();
    await expect(page.getByRole('textbox', { name: /title/i })).toBeVisible();
  });

  test('shows a parse error for an invalid schema', async ({ page }) => {
    await page
      .getByRole('textbox', { name: /zod schema input/i })
      .fill('z.string()');
    await page.getByRole('button', { name: /visualize/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });
});

test.describe('Form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: /paste schema/i }).click();
    await page.getByRole('button', { name: 'User Profile' }).click();
  });

  test('Submit button is always enabled and shows inline errors on empty submit', async ({
    page,
  }) => {
    const submit = page.getByRole('button', { name: /submit/i });
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(
      page.getByText(/this field is required/i).first()
    ).toBeVisible();
  });

  test('shows field-level error for invalid email on submit', async ({
    page,
  }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Alice');
    await page.getByRole('textbox', { name: /email/i }).fill('not-an-email');
    await page.getByRole('spinbutton', { name: /age/i }).fill('25');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByRole('textbox', { name: /email/i })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  test('shows failed validation count in footer', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Alice');
    await page.getByRole('textbox', { name: /email/i }).fill('bad');
    await page.getByRole('spinbutton', { name: /age/i }).fill('25');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/failed validation/i)).toBeVisible();
  });

  test('error clears after editing the invalid field', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Alice');
    await page.getByRole('textbox', { name: /email/i }).fill('bad');
    await page.getByRole('spinbutton', { name: /age/i }).fill('25');
    await page.getByRole('button', { name: /submit/i }).click();

    await page
      .getByRole('textbox', { name: /email/i })
      .fill('alice@example.com');
    await expect(
      page.getByRole('textbox', { name: /email/i })
    ).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('shows success state after valid submission', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Alice');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('alice@example.com');
    await page.getByRole('spinbutton', { name: /age/i }).fill('25');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(
      page.getByText(/Your data has been successfully parsed and validated./i)
    ).toBeVisible();
  });

  test('success screen shows the submitted JSON', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Alice');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('alice@example.com');
    await page.getByRole('spinbutton', { name: /age/i }).fill('25');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/"name"/)).toBeVisible();
    await expect(page.getByText(/"Alice"/)).toBeVisible();
  });
});
