import { test as base } from '@playwright/test';

import { docs } from './data.ts';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/**/search/**', async (route) => {
      if (route.request().url().includes('collections')) {
        const json = [{ name: 'fake-collections', id: 21 }];
        await route.fulfill({ json });
      } else if (route.request().url().includes('nb_docs')) {
        await route.fulfill({ json: { nb_docs: 10 } });
      } else if (route.request().url().includes('by_document')) {
        await route.fulfill({ status: 200, body: JSON.stringify(docs) });
        await page.waitForLoadState();
      }
    });
    await page.goto('/');
    // Close the welcome modal
    await page.getByRole('button', { name: 'close' }).click();
    await page.waitForLoadState();

    await use(page);
  }
});

export { expect } from '@playwright/test';
