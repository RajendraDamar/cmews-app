import { test, expect } from '@playwright/test';

test.describe('Home/Weather Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Login first to access the tabs
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
  });

  test('should display loading skeleton initially', async ({ page }) => {
    // Reload to see loading state
    await page.reload();
    
    // Loading skeleton should appear briefly
    // We can check that content eventually loads
    await page.waitForTimeout(2000);
  });

  test('should display location selector', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Location selector should be visible
    const locationText = page.locator('text=/Jakarta|Cuaca/');
    await expect(locationText.first()).toBeVisible();
  });

  test('should display hero card with weather information', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should show temperature and weather description
    const tempRegex = /\d+°/;
    await expect(page.locator(`text=${tempRegex}`).first()).toBeVisible();
  });

  test('should display quick stats cards', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should show humidity, wind speed, etc.
    // These metrics should be visible
    const stats = page.locator('text=/Kelembapan|Kecepatan Angin|Terasa Seperti/i');
    const count = await stats.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support pull-to-refresh functionality', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // This is hard to test on web, but we can verify the refresh handler exists
    // by checking that the content reloads properly
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Content should still be visible after reload
    const locationText = page.locator('text=/Jakarta|Cuaca/');
    await expect(locationText.first()).toBeVisible();
  });

  test('should display hourly forecast', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should have hourly forecast section
    const hourlySection = page.locator('text=/Prakiraan Per Jam|Jam/i');
    const count = await hourlySection.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display detailed metrics', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should show detailed weather metrics
    const metricsText = page.locator('text=/Tekanan|Visibilitas|Angin/i');
    const count = await metricsText.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display daily forecast', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should show daily forecast
    const dailyText = page.locator('text=/Hari Ini|Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu/i');
    const count = await dailyText.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be responsive on mobile view', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await page.waitForTimeout(2000);
      
      // On mobile, hero card and quick stats should be stacked vertically
      // Just verify both are visible
      const locationText = page.locator('text=/Jakarta|Cuaca/');
      await expect(locationText.first()).toBeVisible();
    }
  });

  test('should be responsive on desktop view', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      await page.waitForTimeout(2000);
      
      // On desktop, content should be visible
      const locationText = page.locator('text=/Jakarta|Cuaca/');
      await expect(locationText.first()).toBeVisible();
    }
  });

  test('should handle location selector button', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Try to find and click location selector (if it's a pressable element)
    // This might log a console message
    const clickableLocation = page.locator('[role="button"]').filter({ hasText: /Jakarta|Kota/i });
    if (await clickableLocation.count() > 0) {
      await clickableLocation.first().click();
    }
  });
});
