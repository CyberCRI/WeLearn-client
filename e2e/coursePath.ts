import type { Page } from '@playwright/test';

import { syllabusFile } from './data';

// screens 1 and 2 of the "I have a course" path with the mocks of base.ts: the course read,
// then confirmed. starts on the path question
export async function confirmCourse(page: Page) {
  await page.getByTestId('option-existing').click();
  await page.getByTestId('course-file-input').setInputFiles(syllabusFile);
  await page.getByTestId('read-course-button').click();
  await page.getByTestId('confirm-course').click();
}

// the supported connections of screen 3 (the mocks back only the first idea)
export const connectionCards = (page: Page) =>
  page.locator('.connection-list').first().getByTestId('connection');

// screen 3: the first connection chosen and developed into a change, accepted as proposed
export async function acceptFirstConnection(page: Page) {
  const card = connectionCards(page).first();
  await card.getByTestId('select').click();
  await card.getByTestId('develop').click();
  await card.getByTestId('development').getByTestId('accept-change').click();
  return card;
}
