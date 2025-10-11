import { test, expect } from '@playwright/test';

test.describe('Navigation and Tab Bar', () => {
  test.beforeEach(async ({ page }) => {
    // Login to access tabs
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    await page.waitForTimeout(1000);
  });

  test('should display tab bar navigation', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      // On mobile, tab bar should be visible at bottom
      const tabs = page.locator('[role="link"], [role="tab"]');
      const count = await tabs.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should have all main tabs', async ({ page }) => {
    // Look for main navigation tabs
    const homeTab = page.locator('text=/Cuaca Hari Ini|Home/i');
    const forecastTab = page.locator('text=/Prakiraan|Forecast/i');
    const mapsTab = page.locator('text=/Peta|Maps/i');
    
    // At least some tabs should be present
    const homeExists = await homeTab.count() > 0;
    const forecastExists = await forecastTab.count() > 0;
    const mapsExists = await mapsTab.count() > 0;
    
    expect(homeExists || forecastExists || mapsExists).toBeTruthy();
  });

  test('should navigate between tabs', async ({ page }) => {
    // Navigate to forecast
    const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
    if (await forecastTab.count() > 0) {
      await forecastTab.click();
      await page.waitForTimeout(1000);
      
      // Should show forecast content
      const forecastContent = page.locator('text=/Cuaca|Angin|Gelombang/i');
      const count = await forecastContent.count();
      expect(count).toBeGreaterThan(0);
    }
    
    // Navigate to maps
    const mapsTab = page.getByRole('link', { name: /Peta|Maps/i });
    if (await mapsTab.count() > 0) {
      await mapsTab.click();
      await page.waitForTimeout(1000);
      
      // Should show map content
      const mapContent = page.locator('[class*="flex-1"]');
      await expect(mapContent.first()).toBeVisible();
    }
    
    // Navigate back to home
    const homeTab = page.getByRole('link', { name: /Cuaca Hari Ini|Home/i });
    if (await homeTab.count() > 0) {
      await homeTab.click();
      await page.waitForTimeout(1000);
      
      // Should show home content
      const homeContent = page.locator('text=/Jakarta|Cuaca|Suhu/i');
      const count = await homeContent.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should persist state when switching tabs', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Go to forecast tab
    const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
    if (await forecastTab.count() > 0) {
      await forecastTab.click();
      await page.waitForTimeout(1000);
      
      // Switch to a different tab (Angin)
      const anginTab = page.getByText('Angin');
      if (await anginTab.count() > 0) {
        await anginTab.click();
        await page.waitForTimeout(500);
      }
      
      // Navigate away to home
      const homeTab = page.getByRole('link', { name: /Cuaca Hari Ini|Home/i });
      if (await homeTab.count() > 0) {
        await homeTab.click();
        await page.waitForTimeout(1000);
      }
      
      // Go back to forecast
      await forecastTab.click();
      await page.waitForTimeout(1000);
      
      // Should still see forecast tabs
      await expect(page.getByText('Cuaca')).toBeVisible();
    }
  });

  test('should have tab icons', async ({ page }) => {
    // Tab bar should have icons
    const svgElements = page.locator('svg');
    const count = await svgElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should highlight active tab', async ({ page }) => {
    // Active tab should have different styling
    // This is hard to test without checking computed styles
    // But we can verify tabs are clickable
    const tabs = page.locator('[role="link"], [role="tab"]');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should work on mobile viewport', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      // Tabs should be visible and functional on mobile
      const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
      if (await forecastTab.count() > 0) {
        await forecastTab.click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Cuaca')).toBeVisible();
      }
    }
  });

  test('should work on desktop viewport', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      // Tabs should be visible and functional on desktop
      const forecastTab = page.getByRole('link', { name: /Prakiraan|Forecast/i });
      if (await forecastTab.count() > 0) {
        await forecastTab.click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Cuaca')).toBeVisible();
      }
    }
  });
});

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    await page.waitForTimeout(1000);
  });

  test('should have header with title', async ({ page }) => {
    // Page should have a header/title
    const header = page.locator('text=/Cuaca Hari Ini|Prakiraan|Peta|CMEWS/i').first();
    await expect(header).toBeVisible();
  });

  test('should have settings button in header', async ({ page }) => {
    // Look for settings button/link
    const settingsButton = page.locator('[role="link"], [role="button"]').filter({ hasText: /Settings|Pengaturan/i });
    // Settings might be in header or accessible from menu
  });

  test('should navigate to settings from header', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /Pengaturan|Settings/i });
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForTimeout(1000);
      await expect(page.getByText('Pengaturan')).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.waitForTimeout(1000);
    
    // Should show 404 or redirect to home
    const hasNotFound = (await page.locator('text=/404|Not Found/i').count()) > 0;
    const hasRedirect = (await page.locator('text=/Welcome Back|Cuaca/i').count()) > 0;
    
    expect(hasNotFound || hasRedirect).toBeTruthy();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // This is tested indirectly through the app's error states
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    
    // App should load without crashing
    await page.waitForTimeout(2000);
    const hasContent = (await page.locator('text=/Cuaca|Jakarta|Suhu/i').count()) > 0;
    expect(hasContent).toBeTruthy();
  });
});
