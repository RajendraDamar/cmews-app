import { test, expect } from '@playwright/test';

test.describe('Authentication Screens', () => {
  test.describe('Login Screen', () => {
    test('should display login form elements', async ({ page }) => {
      await page.goto('/');
      
      // Check for title
      await expect(page.getByText('Welcome Back')).toBeVisible();
      await expect(page.getByText('Sign in to your account to continue')).toBeVisible();
      
      // Check for form fields
      await expect(page.getByPlaceholder('email@example.com')).toBeVisible();
      await expect(page.getByPlaceholder('••••••••')).toBeVisible();
      
      // Check for buttons
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    });

    test('should allow entering email and password', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.getByPlaceholder('email@example.com');
      const passwordInput = page.getByPlaceholder('••••••••');
      
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      await expect(emailInput).toHaveValue('test@example.com');
      await expect(passwordInput).toHaveValue('password123');
    });

    test('should navigate to register screen when Create Account is clicked', async ({ page }) => {
      await page.goto('/');
      
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Should see register form
      await expect(page.getByText('Create Account')).toBeVisible();
      await expect(page.getByText('Sign up to get started')).toBeVisible();
    });

    test('should navigate to tabs when Sign In is clicked', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.getByPlaceholder('email@example.com');
      const passwordInput = page.getByPlaceholder('••••••••');
      
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Should navigate to main app - wait for navigation
      await page.waitForURL(/\/(tabs)/);
    });
  });

  test.describe('Register Screen', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Create Account' }).click();
    });

    test('should display register form elements', async ({ page }) => {
      // Check for title
      await expect(page.getByText('Create Account')).toBeVisible();
      await expect(page.getByText('Sign up to get started')).toBeVisible();
      
      // Check for form fields
      await expect(page.getByPlaceholder('John Doe')).toBeVisible();
      await expect(page.getByPlaceholder('email@example.com')).toBeVisible();
      await expect(page.getByPlaceholder('••••••••')).toBeVisible();
      
      // Check for buttons
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Already have an account/ })).toBeVisible();
    });

    test('should allow entering registration details', async ({ page }) => {
      const nameInput = page.getByPlaceholder('John Doe');
      const emailInput = page.getByPlaceholder('email@example.com');
      const passwordInput = page.getByPlaceholder('••••••••');
      
      await nameInput.fill('Test User');
      await emailInput.fill('newuser@example.com');
      await passwordInput.fill('newpassword123');
      
      await expect(nameInput).toHaveValue('Test User');
      await expect(emailInput).toHaveValue('newuser@example.com');
      await expect(passwordInput).toHaveValue('newpassword123');
    });

    test('should navigate back to login when sign in link is clicked', async ({ page }) => {
      await page.getByRole('button', { name: /Already have an account/ }).click();
      
      // Should see login form
      await expect(page.getByText('Welcome Back')).toBeVisible();
      await expect(page.getByText('Sign in to your account to continue')).toBeVisible();
    });

    test('should navigate to tabs when Sign Up is clicked', async ({ page }) => {
      const nameInput = page.getByPlaceholder('John Doe');
      const emailInput = page.getByPlaceholder('email@example.com');
      const passwordInput = page.getByPlaceholder('••••••••');
      
      await nameInput.fill('Test User');
      await emailInput.fill('newuser@example.com');
      await passwordInput.fill('newpassword123');
      
      await page.getByRole('button', { name: 'Sign Up' }).click();
      
      // Should navigate to main app
      await page.waitForURL(/\/(tabs)/);
    });
  });
});
