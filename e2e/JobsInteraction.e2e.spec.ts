import { test, expect } from '@playwright/test'

test.describe('Jobs UI Interaction', () => {
  test('should allow liking a job on detail page', async ({ page }) => {
    await page.goto('/jobs')
    // Go to the detail page of the first job
    await page.getByRole('heading', { name: /Développeur Frontend Vue\.js/i, level: 3 }).click()
    await expect(page).toHaveURL(/\/jobs\//)
    // Find the like button (heart icon)
    const likeButton = page.locator('button[aria-pressed] svg').first()
    // Check initial state (not liked)
    await expect(likeButton).not.toHaveClass(/fill-pink-500/)
    // Click the like button
    await likeButton.click()
    // Check that the state has changed (liked)
    await expect(likeButton).toHaveClass(/fill-pink-500/)
  })
})
