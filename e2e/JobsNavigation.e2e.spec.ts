import { test, expect } from '@playwright/test'

// This test assumes the dev server is running and the app is accessible at http://localhost:5173 or similar.
// Adjust the baseURL if needed in your Playwright config.

test.describe('Jobs UI Navigation', () => {
  test('should display the jobs list', async ({ page }) => {
    await page.goto('/jobs')
    await expect(page.getByRole('heading', { name: /liste des offres/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Développeur Frontend Vue\.js/i, level: 3 })).toBeVisible()
  })

  test('should navigate to job detail on click', async ({ page }) => {
    await page.goto('/jobs')
    // Click on the job title (h3)
    await page.getByRole('heading', { name: /Développeur Frontend Vue\.js/i, level: 3 }).click()
    // Wait for navigation and check detail page content
    await expect(page).toHaveURL(/\/jobs\//)
    await expect(page.getByText(/ID du job/i)).toBeVisible()
  })
})
