import { expect, test } from '@playwright/test'

test.describe('Estimation Wizard', () => {
  test('submits the 5-step flow and displays estimated range', async ({ page }) => {
    await page.route('**/api/estimate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          priceLow: 350000,
          priceHigh: 380000,
          priceMedianSqm: 3650,
          comparableCount: 14,
          precisionLevel: 3,
          queryLevel: 3,
        }),
      })
    })

    await page.goto('/estimer')

    await page.getByRole('button', { name: 'Appartement' }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    await page.selectOption('#postalCode', '20000')
    await page.getByRole('button', { name: /Suivant/i }).click()

    await page.getByRole('button', { name: /Suivant/i }).click()

    await page.getByRole('button', { name: /^Bon$/ }).click()
    await page.getByRole('button', { name: /Suivant/i }).click()

    await page.fill('#fullName', 'Marie Test')
    await page.fill('#email', 'marie.test@example.com')
    await page.fill('#phone', '0612345678')
    await page.getByRole('checkbox').check()

    await page.getByRole('button', { name: /Obtenir mon estimation/i }).click()

    await expect(page.getByText(/Estimation de votre bien/i)).toBeVisible()
    await expect(page.getByText(/350.*380.*EUR/i)).toBeVisible()
    await expect(page.getByText(/3.*650.*EUR\/m2/i)).toBeVisible()
  })
})
