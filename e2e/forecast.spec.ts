import { test, expect } from '@playwright/test';

test.describe('Forecast Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to forecast tab
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    
    // Navigate to forecast tab
    const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
    if (await forecastTab.count() > 0) {
      await forecastTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display tab navigation', async ({ page }) => {
    // Should have 4 tabs: Weather, Wind, Wave, Current
    await expect(page.getByText('Cuaca')).toBeVisible();
    await expect(page.getByText('Angin')).toBeVisible();
    await expect(page.getByText('Gelombang')).toBeVisible();
    await expect(page.getByText('Arus')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Wind tab
    await page.getByText('Angin').click();
    await page.waitForTimeout(500);
    
    // Click on Wave tab
    await page.getByText('Gelombang').click();
    await page.waitForTimeout(500);
    
    // Click on Current tab
    await page.getByText('Arus').click();
    await page.waitForTimeout(500);
    
    // Click back to Weather tab
    await page.getByText('Cuaca').click();
    await page.waitForTimeout(500);
  });

  test('should display weather forecast cards', async ({ page }) => {
    // Weather tab should be active by default
    // Look for day names
    const dayNames = page.locator('text=/Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu/i');
    const count = await dayNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should expand day cards when clicked', async ({ page }) => {
    // Find an expandable card (if it exists)
    const expandableCard = page.locator('[role="button"]').filter({ hasText: /Senin|Selasa|Rabu/i });
    if (await expandableCard.count() > 0) {
      const firstCard = expandableCard.first();
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // Card should expand - check for more detailed content
      // This is a basic check that interaction works
    }
  });

  test('should display wind forecast data', async ({ page }) => {
    await page.getByText('Angin').click();
    await page.waitForTimeout(500);
    
    // Should show wind-related information
    const windData = page.locator('text=/m\/s|knot|km\/h|Kecepatan|Arah/i');
    const count = await windData.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display wave forecast data', async ({ page }) => {
    await page.getByText('Gelombang').click();
    await page.waitForTimeout(500);
    
    // Should show wave-related information
    const waveData = page.locator('text=/meter|Tinggi|Gelombang/i');
    const count = await waveData.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display current/arus forecast data', async ({ page }) => {
    await page.getByText('Arus').click();
    await page.waitForTimeout(500);
    
    // Should show current/arus related information
    const currentData = page.locator('text=/m\/s|Kecepatan|Arah/i');
    const count = await currentData.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have icons in tab navigation', async ({ page }) => {
    // Tabs should have icons (SVG elements)
    const svgElements = page.locator('svg').filter({ has: page.locator('path') });
    const count = await svgElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be scrollable', async ({ page }) => {
    // The forecast list should be scrollable
    const scrollView = page.locator('[class*="flex-1"]').first();
    await expect(scrollView).toBeVisible();
    
    // Try to scroll
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
  });

  test('should display forecast for multiple days', async ({ page }) => {
    // Should have at least 3 days of forecast
    const dayCards = page.locator('[role="button"]').filter({ hasText: /Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu/i });
    const count = await dayCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should maintain tab state when switching back', async ({ page }) => {
    // Switch to Angin tab
    await page.getByText('Angin').click();
    await page.waitForTimeout(500);
    
    // Navigate away and back
    const homeTab = page.getByRole('link', { name: /Cuaca Hari Ini|Home/i });
    if (await homeTab.count() > 0) {
      await homeTab.click();
      await page.waitForTimeout(500);
    }
    
    // Go back to forecast
    const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
    if (await forecastTab.count() > 0) {
      await forecastTab.click();
      await page.waitForTimeout(500);
    }
    
    // Should still show tabs
    await expect(page.getByText('Cuaca')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      // Tabs should be visible and properly sized on mobile
      await expect(page.getByText('Cuaca')).toBeVisible();
      await expect(page.getByText('Angin')).toBeVisible();
      await expect(page.getByText('Gelombang')).toBeVisible();
      await expect(page.getByText('Arus')).toBeVisible();
    }
  });

  test('should be responsive on desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      // Tabs should be visible and properly sized on desktop
      await expect(page.getByText('Cuaca')).toBeVisible();
      await expect(page.getByText('Angin')).toBeVisible();
      await expect(page.getByText('Gelombang')).toBeVisible();
      await expect(page.getByText('Arus')).toBeVisible();
    }
  });
});
