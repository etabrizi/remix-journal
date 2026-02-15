import { test, expect } from '@playwright/test';

const todayIso = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Helper: select a date in the home form
async function pickDate(page: any, date: string) {
  await page.fill('input[name="date"]', date);
  await page.click('button:has-text("Open day")');
}

// Routes use month slug in URL (e.g., /jan/29/2026)
function toSlugPath(date: string) {
  const d = new Date(date);
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const month = months[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `/${month}/${day}/${year}`;
}

test.describe('Journal flow', () => {
  test('create and view a note for today', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('home.png');
    await pickDate(page, todayIso);

    // Should land on the slugified date route
    await expect(page).toHaveURL(new RegExp(toSlugPath(todayIso).replace('/', '\\/')));
    await expect(page).toHaveScreenshot('journal-empty.png');

    // Enter and save notes
    const noteText = 'My Playwright note';
    await page.fill('textarea[name="notes"]', noteText);
    await page.click('button:has-text("Save notes")');
    await expect(page.getByText('Saved successfully')).toBeVisible();

    // Wait for save and verify the text persists after reload
    await page.waitForTimeout(200);
    await page.reload();
    await expect(page.locator('textarea[name="notes"]')).toHaveValue(noteText);
    await expect(page).toHaveScreenshot('journal-saved.png');
  });
});

test.describe('About pages', () => {
  test('navigate to about profile', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About this demo');
    await expect(page).toHaveURL(/about$/);
    await expect(page).toHaveScreenshot('about.png');
  });
});

test.describe('Error handling', () => {
  test('shows server error when upstream fails', async ({ page }) => {
    await page.goto('/jan/01/2026?forceError=1');
    await expect(page).toHaveURL(/jan\/01\/2026/);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('entry-error')).toBeVisible();
  });
});
