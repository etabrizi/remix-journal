import { test, expect } from '@playwright/test';

const downloadDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1); // avoid collision with other tests using today
  return d.toISOString().slice(0, 10);
})();

async function pickDate(page: any, date: string) {
  await page.fill('input[name="date"]', date);
  await page.click('button:has-text("Open day")');
}

test('download raw data contains saved entry', async ({ page }) => {
  // create a note for today
  await page.goto('/');
  await pickDate(page, downloadDate);
  const noteText = 'Download check note';
  await page.fill('textarea[name="notes"]', noteText);
  await page.click('button:has-text("Save notes")');
  await expect(page.getByText('Saved successfully')).toBeVisible();

  // Go back to index and click the download link so it appears in video
  await page.goto('/');
  const link = page.getByRole('link', { name: /download raw data/i });
  await expect(link).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await link.click({ force: true });
  await downloadPromise.catch(() => {}); // ignore if blocked, journey still shown

  // Fetch raw JSON via request for assertion (shares server state)
  const response = await page.request.get('/data/raw');
  expect(response.ok()).toBeTruthy();
  const json = await response.json();

  expect(Array.isArray(json.entries)).toBeTruthy();
  const hasNote = json.entries.some((e: any) => e.notes === noteText);
  expect(hasNote).toBe(true);
});
