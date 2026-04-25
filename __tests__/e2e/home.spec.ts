import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('renders hero and allows navigation to market page', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: /Estimez/i }),
    ).toBeVisible()

    await expect(page.getByRole('link', { name: /Estimer mon bien/i }).first()).toBeVisible()

    await page.getByRole('link', { name: /Marche/i }).first().click()

    await expect(page).toHaveURL(/\/marche$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /March/i }),
    ).toBeVisible()
  })

  test('exposes legal links in footer', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()

    await expect(page.getByRole('link', { name: /Mentions legales/i })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Politique de confidentialite/i }),
    ).toBeVisible()
  })
})
