import { expect, test } from '@playwright/test'

test.describe('Expert Callback Form', () => {
  test('submits callback request and shows success confirmation', async ({ page }) => {
    let requestPayload: Record<string, unknown> | null = null

    await page.route('**/api/contact', async (route) => {
      requestPayload = JSON.parse(route.request().postData() || '{}') as Record<string, unknown>
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/expert')

    await page.locator('#fullName').scrollIntoViewIfNeeded()
    await page.fill('#fullName', 'Paul Martin')
    await page.fill('#phone', '0611223344')
    await page.getByRole('button', { name: 'Matin' }).click()
    await page.getByRole('button', { name: 'Lundi' }).click()
    await page.fill('#message', 'Je souhaite un rappel pour une estimation sur Ajaccio 20090.')

    await page.getByRole('button', { name: /Envoyer ma demande de rappel/i }).click()

    await expect(page.getByRole('heading', { level: 3, name: /demande/i })).toBeVisible()
    await expect(page.getByText(/Notre expert vous rappelle sous 24h/i)).toBeVisible()

    expect(requestPayload).not.toBeNull()
    const payload = requestPayload as unknown as Record<string, unknown>
    expect(payload.full_name).toBe('Paul Martin')
    expect(payload.phone).toBe('0611223344')
    expect(payload.source_page).toBe('/expert')
  })
})
