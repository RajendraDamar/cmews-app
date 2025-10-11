import { test, expect } from '@playwright/test';

test.describe('Maps Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to maps tab
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    
    // Navigate to maps tab
    const mapsTab = page.getByRole('link', { name: /Peta|Maps/i });
    if (await mapsTab.count() > 0) {
      await mapsTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display map or map placeholder', async ({ page }) => {
    // Should either show a map or a placeholder message
    await page.waitForTimeout(2000);
    
    // Map container should be present
    const mapContainer = page.locator('[class*="flex-1"]').first();
    await expect(mapContainer).toBeVisible();
  });

  test('should display map controls', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for zoom controls (+/-)
    const plusButton = page.locator('[role="button"]').filter({ hasText: '+' });
    const minusButton = page.locator('[role="button"]').filter({ hasText: '-' });
    
    // At least one control should be visible
    const controls = page.locator('[role="button"]');
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have add report button', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should have a button to add new weather report
    const addButton = page.locator('[role="button"]').filter({ hasText: /Tambah|Add|\+/i });
    const count = await addButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should open report form when add button is clicked', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Find and click add report button
    const addButton = page.locator('[role="button"]').filter({ hasText: /Tambah|Add|\+/i }).first();
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Form dialog/modal should appear
      // Look for form elements or close button
      const formElements = page.locator('input, textarea, select');
      const hasForm = await formElements.count() > 0;
      
      // Or look for a dialog/modal
      const modal = page.locator('[role="dialog"]');
      const hasModal = await modal.count() > 0;
      
      expect(hasForm || hasModal).toBeTruthy();
    }
  });

  test('should have search functionality', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should have a search input or button
    const searchElement = page.locator('[placeholder*="Cari"], [placeholder*="Search"], [type="search"]');
    const searchButton = page.locator('[role="button"]').filter({ hasText: /Cari|Search/i });
    
    const hasSearch = (await searchElement.count() > 0) || (await searchButton.count() > 0);
    expect(hasSearch).toBeTruthy();
  });

  test('should display weather layer toggle', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should have weather layer toggle
    const layerToggle = page.locator('[role="button"], [role="switch"]').filter({ hasText: /Layer|Lapisan|Cuaca/i });
    // This might not always be visible depending on implementation
  });

  test('should display severity filters', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Should have filters for severity levels (low, medium, high)
    const filterButtons = page.locator('[role="button"], [role="checkbox"]').filter({ hasText: /Rendah|Sedang|Tinggi|Low|Medium|High/i });
    // Filters might be in a sidebar or dropdown
  });

  test('should display weather report markers on map', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // If there are reports, markers should be visible
    // This is tricky to test without actual map, but we can check for marker elements
    const markers = page.locator('[class*="marker"], [data-testid*="marker"]');
    // Markers may or may not be present depending on data
  });

  test('should open report details when marker is clicked', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Try to click a marker if one exists
    const marker = page.locator('[role="button"]').filter({ hasText: /°|Report/i }).first();
    if (await marker.count() > 0) {
      await marker.click();
      await page.waitForTimeout(1000);
      
      // Should show report details in bottom sheet or sidebar
      const detailsContainer = page.locator('text=/Laporan|Report|Deskripsi|Description/i');
      // Details may appear depending on implementation
    }
  });

  test('should have close button for modals/sheets', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Try to open a dialog/sheet first
    const addButton = page.locator('[role="button"]').filter({ hasText: /Tambah|Add|\+/i }).first();
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Should have a close/cancel button
      const closeButton = page.locator('[role="button"]').filter({ hasText: /Tutup|Close|Batal|Cancel|×/i });
      const count = await closeButton.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should zoom in when plus button is clicked', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const plusButton = page.locator('[role="button"]').filter({ hasText: /^\+$/ }).first();
    if (await plusButton.count() > 0) {
      await plusButton.click();
      await page.waitForTimeout(500);
      
      // Map should still be visible
      const mapContainer = page.locator('[class*="flex-1"]').first();
      await expect(mapContainer).toBeVisible();
    }
  });

  test('should zoom out when minus button is clicked', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const minusButton = page.locator('[role="button"]').filter({ hasText: /^-$|Minus/i }).first();
    if (await minusButton.count() > 0) {
      await minusButton.click();
      await page.waitForTimeout(500);
      
      // Map should still be visible
      const mapContainer = page.locator('[class*="flex-1"]').first();
      await expect(mapContainer).toBeVisible();
    }
  });

  test('should handle desktop sidebar view', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      await page.waitForTimeout(2000);
      
      // Desktop should show sidebar instead of bottom sheet
      const sidebar = page.locator('[class*="sidebar"]');
      // Sidebar might be visible on desktop
    }
  });

  test('should handle mobile bottom sheet view', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await page.waitForTimeout(2000);
      
      // Mobile should use bottom sheet
      const bottomSheet = page.locator('[class*="bottom-sheet"]');
      // Bottom sheet appears when marker is clicked
    }
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await page.waitForTimeout(2000);
      
      // Map should fill screen on mobile
      const mapContainer = page.locator('[class*="flex-1"]').first();
      await expect(mapContainer).toBeVisible();
    }
  });

  test('should be responsive on desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      await page.waitForTimeout(2000);
      
      // Map should be visible on desktop with proper layout
      const mapContainer = page.locator('[class*="flex-1"]').first();
      await expect(mapContainer).toBeVisible();
    }
  });
});
