import { test, expect } from './base';

// WL-011: the contribution cards must open from the keyboard
test.describe('microlearning flip cards', () => {
  test('a keyboard-only user flips every card and moves on', async ({ page }) => {
    await page.goto('/learn/discipline');

    const press = async (name: string, key = 'Enter') => {
      const button = page.getByRole('button', { name, exact: true });
      await button.focus();
      await page.keyboard.press(key);
    };

    // each screen fades out before the next one mounts: wait for the new screen before pressing,
    // or the press can land on the button of the screen that is leaving
    await press('Mathématiques');
    await press('Voir mon parcours');
    await expect(page.getByText('Votre parcours est prêt')).toBeVisible();
    await press('Commencer');
    await expect(page.getByText('Deux petites questions')).toBeVisible();
    await press('Commencer');

    const cards = page.locator('.numbered-card button');
    const next = page.getByRole('button', { name: 'Suivant' });
    await expect(cards).toHaveCount(4);
    await expect(next).toBeEnabled();

    // tab from card to card, flipping with Enter and Space in turn
    await cards.first().focus();
    for (let i = 0; i < 4; i++) {
      if (i > 0) await page.keyboard.press('Tab');
      await expect(cards.nth(i)).toBeFocused();
      await expect(cards.nth(i)).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      await expect(cards.nth(i)).toHaveAttribute('aria-expanded', 'true');
    }

    await expect(page.getByText('✓ Bravo !')).toBeVisible();

    await next.focus();
    await page.keyboard.press('Enter');
    await expect(cards).toHaveCount(0);
    await expect(page).toHaveURL(/step=1/);
  });
});
