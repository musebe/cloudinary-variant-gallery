import { test, expect } from '@playwright/test'

test('saved catalog loads and a detail view stays with the selected color', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('radio', { name: 'Forest', exact: true })).toBeChecked()
  await page.getByRole('radio', { name: 'Clay', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Clay: 2 matching images')
  const gallery = page.getByRole('region', { name: 'Clay product images' })
  await expect(gallery.locator('img').first()).toHaveAttribute('alt', /in clay, full product view/)
  await expect(gallery.locator('img').first()).toHaveJSProperty('complete', true)
  await expect.poll(() => gallery.locator('img').first().evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Clay finish detail' }).click()
  await expect(gallery.locator('img').first()).toHaveAttribute('alt', /in clay, shade and finish detail/)
  expect(errors).toEqual([])
})

test('missing media never falls back to the previous color', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Midnight', exact: true }).click()
  await expect(page.getByText('Images not available for Midnight')).toBeVisible()
  await expect(page.locator('img')).toHaveCount(0)
  await page.getByRole('radio', { name: 'Cream', exact: true }).click()
  await expect(page.locator('img').first()).toHaveAttribute('alt', /in cream, full product view/)
})

test('rapid color changes keep only the final selection and make no Admin calls', async ({ page }) => {
  const managementCalls: string[] = []
  page.on('request', request => { if (request.url().includes('api.cloudinary.com')) managementCalls.push(request.url()) })
  await page.goto('/')
  for (const color of ['Clay', 'Cream', 'Forest', 'Midnight', 'Clay']) await page.getByRole('radio', { name: color, exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Clay', exact: true })).toBeChecked()
  const alternatives = await page.locator('img').evaluateAll(images => images.map(image => image.alt))
  expect(alternatives.length).toBeGreaterThan(0)
  expect(alternatives.every(alt => alt.includes('in clay,'))).toBe(true)
  expect(managementCalls).toEqual([])
})

test('fits the viewport and exposes a read-only catalog', async ({ page, request }) => {
  await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const health = await request.get('/api/health')
  expect((await health.json()).status).toBe('ok')
  const catalog = await request.get('/api/catalog')
  const body = await catalog.text()
  expect(body).not.toMatch(/api_secret|api_key|NUXT_CLOUDINARY/)
  expect((await request.post('/api/catalog')).status()).toBe(404)
})
