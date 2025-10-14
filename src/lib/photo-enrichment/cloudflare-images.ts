/**
 * Cloudflare Images API client
 * Handles uploading images to Cloudflare Images CDN
 */

import { createReadStream, statSync } from 'fs';
// @ts-ignore - FormData types
import FormData from 'form-data';

export interface CloudflareImagesConfig {
  accountId: string;
  apiToken: string;
  deliveryUrl?: string; // e.g., https://imagedelivery.net/<account-hash>
}

export interface UploadResult {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
  cdnUrl: string;
}

export class CloudflareImagesClient {
  private accountId: string;
  private apiToken: string;
  private deliveryUrl: string;
  private baseUrl: string;

  constructor(config: CloudflareImagesConfig) {
    this.accountId = config.accountId;
    this.apiToken = config.apiToken;
    this.deliveryUrl = config.deliveryUrl || '';
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`;
  }

  /**
   * Upload an image file to Cloudflare Images
   */
  async uploadImage(
    filePath: string,
    metadata?: Record<string, string>
  ): Promise<UploadResult> {
    const form = new FormData();
    const stats = statSync(filePath);
    
    form.append('file', createReadStream(filePath), {
      filename: filePath.split('/').pop(),
      knownLength: stats.size
    });

    if (metadata) {
      form.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...form.getHeaders()
      },
      // @ts-ignore - FormData compatibility
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare upload failed: ${response.status} ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      throw new Error(`Cloudflare upload failed: ${JSON.stringify(data.errors)}`);
    }

    const result = data.result;
    const cdnUrl = this.deliveryUrl 
      ? `${this.deliveryUrl}/${result.id}/public`
      : result.variants[0];

    return {
      id: result.id,
      filename: result.filename,
      uploaded: result.uploaded,
      requireSignedURLs: result.requireSignedURLs,
      variants: result.variants,
      cdnUrl
    };
  }

  /**
   * Upload an image from URL
   */
  async uploadFromUrl(
    url: string,
    metadata?: Record<string, string>
  ): Promise<UploadResult> {
    const form = new FormData();
    form.append('url', url);

    if (metadata) {
      form.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...form.getHeaders()
      },
      // @ts-ignore - FormData compatibility
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare upload failed: ${response.status} ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      throw new Error(`Cloudflare upload failed: ${JSON.stringify(data.errors)}`);
    }

    const result = data.result;
    const cdnUrl = this.deliveryUrl 
      ? `${this.deliveryUrl}/${result.id}/public`
      : result.variants[0];

    return {
      id: result.id,
      filename: result.filename,
      uploaded: result.uploaded,
      requireSignedURLs: result.requireSignedURLs,
      variants: result.variants,
      cdnUrl
    };
  }

  /**
   * Delete an image from Cloudflare Images
   */
  async deleteImage(imageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare delete failed: ${response.status} ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      throw new Error(`Cloudflare delete failed: ${JSON.stringify(data.errors)}`);
    }
  }

  /**
   * Get image details
   */
  async getImage(imageId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare get failed: ${response.status} ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      throw new Error(`Cloudflare get failed: ${JSON.stringify(data.errors)}`);
    }

    return data.result;
  }
}

/**
 * Create Cloudflare Images client from environment variables
 */
export function createCloudflareClient(): CloudflareImagesClient {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const deliveryUrl = process.env.CLOUDFLARE_DELIVERY_URL;

  if (!accountId || !apiToken) {
    throw new Error('Missing required Cloudflare environment variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN');
  }

  return new CloudflareImagesClient({
    accountId,
    apiToken,
    deliveryUrl
  });
}
