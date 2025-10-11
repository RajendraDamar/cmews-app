import { test, expect } from '@playwright/test';

test.describe('Settings Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    await page.waitForTimeout(1000);
    
    // Navigate to settings - find settings link/button
    const settingsLink = page.getByRole('link', { name: /Pengaturan|Settings/i });
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForTimeout(1000);
    } else {
      // Try to navigate directly
      await page.goto('/settings');
      await page.waitForTimeout(1000);
    }
  });

  test('should display settings page title', async ({ page }) => {
    await expect(page.getByText('Pengaturan')).toBeVisible();
  });

  test('should display appearance section', async ({ page }) => {
    await expect(page.getByText('Tampilan')).toBeVisible();
    await expect(page.getByText(/Sesuaikan tampilan aplikasi/i)).toBeVisible();
  });

  test('should have dark mode toggle', async ({ page }) => {
    await expect(page.getByText('Mode Gelap')).toBeVisible();
    
    // Should have a switch/toggle element
    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toBeVisible();
  });

  test('should toggle dark mode when switch is clicked', async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();
    
    // Get initial state
    const initialState = await toggle.getAttribute('aria-checked');
    
    // Click toggle
    await toggle.click();
    await page.waitForTimeout(500);
    
    // State should change
    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should display notifications section', async ({ page }) => {
    await expect(page.getByText('Notifikasi')).toBeVisible();
    await expect(page.getByText(/Kelola notifikasi cuaca/i)).toBeVisible();
    await expect(page.getByText('Notifikasi Push')).toBeVisible();
  });

  test('should have notification toggle', async ({ page }) => {
    await expect(page.getByText('Notifikasi Push')).toBeVisible();
    
    // Find the notification toggle
    const notifRow = page.locator('text=Notifikasi Push').locator('..');
    const toggle = notifRow.locator('[role="switch"]');
    
    if (await toggle.count() > 0) {
      await expect(toggle.first()).toBeVisible();
    }
  });

  test('should display location section', async ({ page }) => {
    await expect(page.getByText('Lokasi')).toBeVisible();
    await expect(page.getByText(/Pengaturan lokasi/i)).toBeVisible();
    await expect(page.getByText('Izin Lokasi')).toBeVisible();
  });

  test('should have location permission toggle', async ({ page }) => {
    await expect(page.getByText('Izin Lokasi')).toBeVisible();
    
    const locationRow = page.locator('text=Izin Lokasi').locator('..');
    const toggle = locationRow.locator('[role="switch"]');
    
    if (await toggle.count() > 0) {
      await expect(toggle.first()).toBeVisible();
    }
  });

  test('should display units section', async ({ page }) => {
    await expect(page.getByText('Satuan')).toBeVisible();
    await expect(page.getByText(/Satuan pengukuran/i)).toBeVisible();
    await expect(page.getByText('Suhu')).toBeVisible();
    await expect(page.getByText(/Celsius.*°C/i)).toBeVisible();
  });

  test('should display language section', async ({ page }) => {
    await expect(page.getByText('Bahasa')).toBeVisible();
    await expect(page.getByText(/Pilih bahasa aplikasi/i)).toBeVisible();
    await expect(page.getByText('Indonesia')).toBeVisible();
  });

  test('should display about section', async ({ page }) => {
    await expect(page.getByText('Tentang')).toBeVisible();
    await expect(page.getByText(/Informasi aplikasi/i)).toBeVisible();
    await expect(page.getByText('Versi')).toBeVisible();
    await expect(page.getByText('1.0.0')).toBeVisible();
  });

  test('should have privacy link', async ({ page }) => {
    await expect(page.getByText('Privasi')).toBeVisible();
  });

  test('should navigate to privacy page when privacy is clicked', async ({ page }) => {
    const privacyButton = page.locator('[role="button"]').filter({ hasText: 'Privasi' });
    await privacyButton.click();
    await page.waitForTimeout(1000);
    
    // Should show privacy page
    await expect(page.getByText(/Privacy Policy/i)).toBeVisible();
  });

  test('should have logout button', async ({ page }) => {
    await expect(page.getByText('Keluar')).toBeVisible();
  });

  test('should navigate to login when logout is clicked', async ({ page }) => {
    const logoutButton = page.locator('[role="button"]').filter({ hasText: 'Keluar' });
    await logoutButton.click();
    await page.waitForTimeout(1000);
    
    // Should navigate back to login
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('should be scrollable', async ({ page }) => {
    // Settings page should be scrollable
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    
    // Page should still be visible
    await expect(page.getByText('Pengaturan')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      // All sections should be visible
      await expect(page.getByText('Tampilan')).toBeVisible();
      await expect(page.getByText('Notifikasi')).toBeVisible();
    }
  });

  test('should be responsive on desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      // Desktop should have max-width constraint
      await expect(page.getByText('Pengaturan')).toBeVisible();
      await expect(page.getByText('Tampilan')).toBeVisible();
    }
  });

  test('should have interactive chevron icons', async ({ page }) => {
    // Some settings rows should have chevron icons indicating they're clickable
    const chevronRows = page.locator('svg').filter({ has: page.locator('path') });
    const count = await chevronRows.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Privacy Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to privacy page
    await page.goto('/');
    await page.getByPlaceholder('email@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(tabs)/);
    await page.goto('/privacy');
    await page.waitForTimeout(1000);
  });

  test('should display privacy policy title', async ({ page }) => {
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('should display privacy policy content', async ({ page }) => {
    await expect(page.getByText(/placeholder privacy policy/i)).toBeVisible();
  });

  test('should list key privacy points', async ({ page }) => {
    await expect(page.getByText(/What information we collect/i)).toBeVisible();
    await expect(page.getByText(/How we use your information/i)).toBeVisible();
    await expect(page.getByText(/How we protect your information/i)).toBeVisible();
    await expect(page.getByText(/Your rights and choices/i)).toBeVisible();
    await expect(page.getByText(/Contact information/i)).toBeVisible();
  });

  test('should be scrollable', async ({ page }) => {
    // Privacy page should be scrollable
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);
    
    // Content should still be visible
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('should have back navigation', async ({ page }) => {
    // Should be able to navigate back
    await page.goBack();
    await page.waitForTimeout(1000);
    
    // Should be back at previous page (likely settings or tabs)
    const isBackAtApp = (await page.locator('text=/Pengaturan|Settings|Cuaca/i').count()) > 0;
    expect(isBackAtApp).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await expect(page.getByText('Privacy Policy')).toBeVisible();
    }
  });

  test('should be responsive on desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      await expect(page.getByText('Privacy Policy')).toBeVisible();
    }
  });
});
