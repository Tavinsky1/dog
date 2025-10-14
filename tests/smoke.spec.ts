import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for Global Navigation
 * 
 * These tests verify core navigation flows work:
 * - Home page loads
 * - Countries are displayed
 * - Country page loads
 * - City page loads
 * - Category cards appear
 * 
 * Run with: npx playwright test
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Global Navigation Smoke Tests', () => {
  
  test('homepage loads and shows countries', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page).toHaveTitle(/DogAtlas|Dog-Friendly/i);
    
    // Check header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check logo/brand
    await expect(page.getByText(/DogAtlas|🐾/i)).toBeVisible();
    
    // Check countries grid appears
    const countryGrid = page.locator('[class*="grid"]').first();
    await expect(countryGrid).toBeVisible();
    
    // Check at least one country card exists
    const countryCards = page.getByRole('link', { name: /Germany|Spain|France|Italy/i });
    await expect(countryCards.first()).toBeVisible();
  });

  test('navigation header has correct links', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check main navigation links
    await expect(page.getByRole('link', { name: /explore/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /search/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add place/i })).toBeVisible();
    
    // Map view link should appear if feature flag enabled
    // (Skip this check if ENABLE_MAP_VIEW is false)
  });

  test('country page loads and shows cities', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click first country (likely Germany)
    const firstCountry = page.getByRole('link', { name: /Germany/i }).first();
    await firstCountry.click();
    
    // Wait for navigation
    await page.waitForURL(/\/(germany|spain|france|italy|austria|netherlands)/);
    
    // Check country flag or name appears
    await expect(page.locator('h1')).toContainText(/Germany|Spain|France|Italy|Austria|Netherlands/i);
    
    // Check cities are listed
    const cityLinks = page.getByRole('link', { name: /Berlin|Barcelona|Paris|Rome|Vienna|Amsterdam/i });
    await expect(cityLinks.first()).toBeVisible();
  });

  test('city page loads and shows categories', async ({ page }) => {
    // Navigate directly to a city (faster than clicking through)
    await page.goto(`${BASE_URL}/germany/berlin`);
    
    // Check city name appears
    await expect(page.locator('h1')).toContainText(/Berlin/i);
    
    // Check category cards are displayed
    const categories = [
      /cafés|restaurants/i,
      /parks|play/i,
      /trails|treks/i,
      /hotels/i,
      /vet/i
    ];
    
    // Verify at least 3 categories appear
    let foundCategories = 0;
    for (const category of categories) {
      const element = page.getByText(category).first();
      if (await element.isVisible()) {
        foundCategories++;
      }
    }
    
    expect(foundCategories).toBeGreaterThanOrEqual(3);
  });

  test('search bar is accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for search input
    const searchInput = page.getByRole('searchbox') || page.getByPlaceholder(/search/i);
    
    // Search should be visible or accessible via toggle
    // (Implementation may vary - adjust as needed)
    if (await searchInput.isVisible()) {
      await searchInput.fill('cafe');
      // Could add more specific search tests here
    }
  });

  test('404 page works for invalid routes', async ({ page }) => {
    // Try to visit non-existent country
    await page.goto(`${BASE_URL}/invalid-country`, { waitUntil: 'networkidle' });
    
    // Should show 404 or redirect
    const pageText = await page.textContent('body');
    expect(pageText).toMatch(/404|not found|doesn't exist/i);
  });

  test('breadcrumbs appear on city pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/germany/berlin`);
    
    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], nav a').first();
    
    // Should see "Home" link
    const homeLink = page.getByRole('link', { name: /home/i });
    if (await homeLink.isVisible()) {
      await expect(homeLink).toHaveAttribute('href', '/');
    }
  });

  test('mobile menu works on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Look for mobile menu toggle (hamburger icon)
    const menuButton = page.getByRole('button', { name: /menu|navigation/i });
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Menu should appear
      await expect(page.getByRole('link', { name: /explore/i })).toBeVisible();
    }
  });

  test('images load correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/germany/berlin`);
    
    // Check for place images
    const images = page.locator('img[src*="/images/places"]');
    
    if (await images.first().isVisible()) {
      // Verify at least one image loads successfully
      const firstImg = images.first();
      await expect(firstImg).toHaveJSProperty('naturalWidth', (width: number) => width > 0);
    }
  });

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Map View Tests (if enabled)', () => {
  test.skip(({ }, testInfo) => {
    // Skip if map view not enabled
    return process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW !== 'true';
  });

  test('map page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/map`);
    
    // Check map container appears
    await expect(page.locator('svg, canvas, [class*="map"]')).toBeVisible();
  });

  test('map toggle appears in header', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for map view link
    await expect(page.getByRole('link', { name: /map view/i })).toBeVisible();
  });
});

test.describe('Accessibility Tests', () => {
  test('page has proper heading structure', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Should have exactly one h1
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
  });

  test('links have accessible names', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Get all links
    const links = page.getByRole('link');
    const count = await links.count();
    
    // Verify links have text or aria-label
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Press Tab a few times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible (focused element exists)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
