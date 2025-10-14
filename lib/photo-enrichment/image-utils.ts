/**
 * Image utilities for offline photo enrichment pipeline
 * Provides image probing, license validation, and dimension checking
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as https from 'https';
import * as http from 'http';
import { pipeline } from 'stream/promises';
import { createWriteStream, createReadStream } from 'fs';
import { unlink } from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Allowed licenses for DogAtlas
 */
export const ALLOWED_LICENSES = [
  'CC0',
  'CC-BY',
  'CC-BY-2.0',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'CC-BY-SA',
  'CC-BY-SA-2.0',
  'CC-BY-SA-3.0',
  'CC-BY-SA-4.0',
  'Public Domain',
  'PDM'
] as const;

export type AllowedLicense = typeof ALLOWED_LICENSES[number];

/**
 * Image metadata
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  mimeType: string;
  sizeBytes: number;
}

/**
 * Validate if a license is allowed
 */
export function isLicenseAllowed(license: string): boolean {
  const normalized = license.trim().toUpperCase().replace(/\s+/g, '-');
  return ALLOWED_LICENSES.some(allowed => 
    normalized.includes(allowed.toUpperCase().replace(/\s+/g, '-'))
  );
}

/**
 * Normalize license string to standard format
 */
export function normalizeLicense(license: string): string {
  const normalized = license.trim().toUpperCase().replace(/\s+/g, '-');
  
  if (normalized.includes('CC0') || normalized.includes('PUBLIC-DOMAIN') || normalized.includes('PDM')) {
    return 'Public Domain';
  }
  if (normalized.includes('CC-BY-SA-4')) return 'CC-BY-SA-4.0';
  if (normalized.includes('CC-BY-SA-3')) return 'CC-BY-SA-3.0';
  if (normalized.includes('CC-BY-SA-2')) return 'CC-BY-SA-2.0';
  if (normalized.includes('CC-BY-SA')) return 'CC-BY-SA';
  if (normalized.includes('CC-BY-4')) return 'CC-BY-4.0';
  if (normalized.includes('CC-BY-3')) return 'CC-BY-3.0';
  if (normalized.includes('CC-BY-2')) return 'CC-BY-2.0';
  if (normalized.includes('CC-BY')) return 'CC-BY';
  
  return license;
}

/**
 * Probe image dimensions and format using ImageMagick identify
 */
export async function probeImage(filePath: string): Promise<ImageMetadata> {
  try {
    const { stdout } = await execAsync(
      `identify -format '%w %h %m %b' "${filePath}"`
    );
    
    const [width, height, format, size] = stdout.trim().split(' ');
    
    const sizeMatch = size.match(/(\d+(?:\.\d+)?)(B|KB|MB|GB)/i);
    let sizeBytes = 0;
    if (sizeMatch) {
      const value = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[2].toUpperCase();
      const multipliers: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
      sizeBytes = Math.floor(value * (multipliers[unit] || 1));
    }

    return {
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      format: format.toLowerCase(),
      mimeType: `image/${format.toLowerCase()}`,
      sizeBytes
    };
  } catch (error) {
    throw new Error(`Failed to probe image: ${error}`);
  }
}

/**
 * Download image from URL to local file
 */
export async function downloadImage(url: string, destPath: string): Promise<void> {
  const protocol = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        reject(new Error(`Not an image: ${contentType}`));
        return;
      }
      
      const fileStream = createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        unlink(destPath).catch(() => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Validate image meets minimum requirements
 */
export async function validateImage(filePath: string, minWidth = 1200): Promise<{
  valid: boolean;
  reason?: string;
  metadata?: ImageMetadata;
}> {
  try {
    const metadata = await probeImage(filePath);
    
    if (metadata.width < minWidth) {
      return {
        valid: false,
        reason: `Image width ${metadata.width}px is below minimum ${minWidth}px`,
        metadata
      };
    }
    
    if (metadata.height < 600) {
      return {
        valid: false,
        reason: `Image height ${metadata.height}px is below minimum 600px`,
        metadata
      };
    }
    
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
    if (!allowedFormats.includes(metadata.format)) {
      return {
        valid: false,
        reason: `Image format ${metadata.format} not allowed`,
        metadata
      };
    }
    
    return { valid: true, metadata };
  } catch (error) {
    return {
      valid: false,
      reason: `Failed to validate: ${error}`
    };
  }
}

/**
 * Fuzzy match two place names (diacritics-insensitive)
 */
export function fuzzyMatchName(name1: string, name2: string, threshold = 0.7): boolean {
  const normalize = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  };
  
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  // Exact match
  if (n1 === n2) return true;
  
  // One contains the other
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Levenshtein distance
  const distance = levenshteinDistance(n1, n2);
  const maxLen = Math.max(n1.length, n2.length);
  const similarity = 1 - distance / maxLen;
  
  return similarity >= threshold;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[len1][len2];
}

/**
 * Calculate distance between two coordinates in meters (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
