/**
 * Unit Tests for Photo Enrichment Pipeline
 */

import { describe, it, expect } from 'vitest';
import {
  isLicenseAllowed,
  normalizeLicense,
  fuzzyMatchName,
  calculateDistance,
  ALLOWED_LICENSES
} from '../lib/photo-enrichment/image-utils';

describe('License Validation', () => {
  it('should allow CC-BY licenses', () => {
    expect(isLicenseAllowed('CC-BY')).toBe(true);
    expect(isLicenseAllowed('CC-BY-4.0')).toBe(true);
    expect(isLicenseAllowed('CC-BY-3.0')).toBe(true);
    expect(isLicenseAllowed('CC-BY-2.0')).toBe(true);
  });

  it('should allow CC-BY-SA licenses', () => {
    expect(isLicenseAllowed('CC-BY-SA')).toBe(true);
    expect(isLicenseAllowed('CC-BY-SA-4.0')).toBe(true);
    expect(isLicenseAllowed('CC-BY-SA-3.0')).toBe(true);
  });

  it('should allow CC0 and Public Domain', () => {
    expect(isLicenseAllowed('CC0')).toBe(true);
    expect(isLicenseAllowed('Public Domain')).toBe(true);
    expect(isLicenseAllowed('PDM')).toBe(true);
  });

  it('should reject non-commercial licenses', () => {
    expect(isLicenseAllowed('CC-BY-NC')).toBe(false);
    expect(isLicenseAllowed('CC-BY-NC-SA')).toBe(false);
    expect(isLicenseAllowed('CC-BY-NC-ND')).toBe(false);
  });

  it('should reject all rights reserved', () => {
    expect(isLicenseAllowed('All Rights Reserved')).toBe(false);
    expect(isLicenseAllowed('Copyright')).toBe(false);
    expect(isLicenseAllowed('')).toBe(false);
  });

  it('should be case-insensitive', () => {
    expect(isLicenseAllowed('cc-by-4.0')).toBe(true);
    expect(isLicenseAllowed('CC BY 4.0')).toBe(true);
    expect(isLicenseAllowed('public domain')).toBe(true);
  });
});

describe('License Normalization', () => {
  it('should normalize CC-BY licenses', () => {
    expect(normalizeLicense('cc-by-4.0')).toBe('CC-BY-4.0');
    expect(normalizeLicense('CC BY 4.0')).toBe('CC-BY-4.0');
    expect(normalizeLicense('CCBY4')).toBe('CC-BY-4.0');
  });

  it('should normalize CC-BY-SA licenses', () => {
    expect(normalizeLicense('cc-by-sa-3.0')).toBe('CC-BY-SA-3.0');
    expect(normalizeLicense('CC BY SA 3.0')).toBe('CC-BY-SA-3.0');
  });

  it('should normalize public domain variants', () => {
    expect(normalizeLicense('CC0')).toBe('Public Domain');
    expect(normalizeLicense('PUBLIC DOMAIN')).toBe('Public Domain');
    expect(normalizeLicense('PDM')).toBe('Public Domain');
  });
});

describe('Fuzzy Name Matching', () => {
  it('should match exact names', () => {
    expect(fuzzyMatchName('Tiergarten', 'Tiergarten')).toBe(true);
    expect(fuzzyMatchName('Café Central', 'Café Central')).toBe(true);
  });

  it('should match case-insensitive', () => {
    expect(fuzzyMatchName('Tiergarten', 'tiergarten')).toBe(true);
    expect(fuzzyMatchName('TIERGARTEN', 'Tiergarten')).toBe(true);
  });

  it('should match with diacritics removed', () => {
    expect(fuzzyMatchName('Café Central', 'Cafe Central')).toBe(true);
    expect(fuzzyMatchName('Münchner Freiheit', 'Munchner Freiheit')).toBe(true);
    expect(fuzzyMatchName('Bärenschänke', 'Barenschanke')).toBe(true);
  });

  it('should match partial names', () => {
    expect(fuzzyMatchName('Berlin Tiergarten', 'Tiergarten')).toBe(true);
    expect(fuzzyMatchName('Tiergarten', 'Berlin Tiergarten')).toBe(true);
  });

  it('should respect similarity threshold', () => {
    expect(fuzzyMatchName('Tiergarten', 'Tierpark', 0.8)).toBe(false);
    expect(fuzzyMatchName('Tiergarten', 'Tierpark', 0.6)).toBe(true);
  });

  it('should not match completely different names', () => {
    expect(fuzzyMatchName('Tiergarten', 'Alexanderplatz')).toBe(false);
    expect(fuzzyMatchName('Café Central', 'Restaurant Roma')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(fuzzyMatchName("O'Reilly's Pub", "OReillys Pub")).toBe(true);
    expect(fuzzyMatchName('Bäcker-Café', 'Backer Cafe')).toBe(true);
  });
});

describe('Distance Calculation', () => {
  it('should calculate distance between coordinates', () => {
    // Berlin TV Tower to Brandenburg Gate (approx 2km)
    const distance = calculateDistance(
      52.52087, 13.40954,  // TV Tower
      52.51628, 13.37771   // Brandenburg Gate
    );
    expect(distance).toBeGreaterThan(1800);
    expect(distance).toBeLessThan(2200);
  });

  it('should return 0 for same coordinates', () => {
    const distance = calculateDistance(52.52087, 13.40954, 52.52087, 13.40954);
    expect(distance).toBeLessThan(1); // Floating point precision
  });

  it('should calculate distance for close points', () => {
    // Two points 100m apart
    const distance = calculateDistance(
      52.52087, 13.40954,
      52.52087, 13.41087
    );
    expect(distance).toBeGreaterThan(80);
    expect(distance).toBeLessThan(120);
  });

  it('should handle negative coordinates', () => {
    // New York to London (approx 5570 km)
    const distance = calculateDistance(
      40.7128, -74.0060,   // New York
      51.5074, -0.1278     // London
    );
    expect(distance).toBeGreaterThan(5500000);
    expect(distance).toBeLessThan(5600000);
  });
});

describe('Image Validation', () => {
  // Note: These tests require actual image files
  // In a real environment, you would use test fixtures

  it('should validate allowed licenses', () => {
    const validLicenses = [
      'CC-BY',
      'CC-BY-4.0',
      'CC-BY-SA',
      'CC-BY-SA-4.0',
      'CC0',
      'Public Domain'
    ];

    validLicenses.forEach(license => {
      expect(isLicenseAllowed(license)).toBe(true);
    });
  });

  it('should reject invalid licenses', () => {
    const invalidLicenses = [
      'CC-BY-NC',
      'CC-BY-ND',
      'All Rights Reserved',
      'Copyright',
      ''
    ];

    invalidLicenses.forEach(license => {
      expect(isLicenseAllowed(license)).toBe(false);
    });
  });
});

describe('Allowed Licenses Constant', () => {
  it('should contain all required licenses', () => {
    expect(ALLOWED_LICENSES).toContain('CC-BY');
    expect(ALLOWED_LICENSES).toContain('CC-BY-4.0');
    expect(ALLOWED_LICENSES).toContain('CC-BY-SA');
    expect(ALLOWED_LICENSES).toContain('Public Domain');
    expect(ALLOWED_LICENSES).toContain('CC0');
  });

  it('should not contain non-commercial licenses', () => {
    expect(ALLOWED_LICENSES).not.toContain('CC-BY-NC');
    expect(ALLOWED_LICENSES).not.toContain('CC-BY-NC-SA');
    expect(ALLOWED_LICENSES).not.toContain('CC-BY-ND');
  });
});
