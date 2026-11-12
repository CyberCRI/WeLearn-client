import { test, expect } from './base';

// WL-011: the trail waits for every card to be flipped, so the cards must work from the keyboard
test.describe('microlearning flip cards', () => {
  test('a keyboard-only user flips every card and moves on', async ({ page }) => {
    await page.goto('/microlearning');

    const press = async (name: string, key = 'Enter') => {
      const button = page.getByRole('button', { name, exact: true });
      await button.focus();
      await page.keyboard.press(key);
    };

    await press('Mathématiques');
    await press('Voir mon parcours');
    await press('Commencer');
    // briefing and self-eval share the "Commencer" label; with the out-in fade the leaving
    // briefing button is still in the dom, so wait for the self-eval screen first
    await expect(page.getByText('Deux petites questions')).toBeVisible();
    await press('Commencer');

    const cards = page.locator('button.flip-card');
    const next = page.getByRole('button', { name: 'Suivant' });
    await expect(cards).toHaveCount(4);
    await expect(next).toBeDisabled();

    // tab from card to card, flipping with Enter and Space in turn
    await cards.first().focus();
    for (let i = 0; i < 4; i++) {
      if (i > 0) await page.keyboard.press('Tab');
      await expect(cards.nth(i)).toBeFocused();
      await expect(cards.nth(i)).toHaveAttribute('aria-pressed', 'false');
      await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      await expect(cards.nth(i)).toHaveAttribute('aria-pressed', 'true');
    }

    await expect(page.getByText('✓ Bravo !')).toBeVisible();
    await expect(next).toBeEnabled();

    await next.focus();
    await page.keyboard.press('Enter');
    await expect(cards).toHaveCount(0);
    await expect(page).toHaveURL(/step=1/);
  });
});
