'use client';

/**
 * Admin Photo Upload Widget
 * 
 * Allows admins to manually upload photos for a place
 * Used in /admin/places/[slug] page
 */

import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface AdminPhotoUploadProps {
  placeId: string;
  placeSlug: string;
  placeName: string;
  onUploadSuccess?: () => void;
}

export function AdminPhotoUpload({
  placeId,
  placeSlug,
  placeName,
  onUploadSuccess
}: AdminPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('CC-BY-4.0');
  const [sourceUrl, setSourceUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleUrlUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const response = await fetch('/api/admin/photos/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          imageUrl,
          author,
          license,
          sourceUrl: sourceUrl || imageUrl
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Photo uploaded successfully! It will appear in the review queue.');
      setImageUrl('');
      setAuthor('');
      setSourceUrl('');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const fileInput = document.getElementById('photo-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('placeId', placeId);
      formData.append('author', author);
      formData.append('license', license);
      formData.append('sourceUrl', sourceUrl || '');

      const response = await fetch('/api/admin/photos/upload-file', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Photo uploaded successfully! It will appear in the review queue.');
      fileInput.value = '';
      setAuthor('');
      setSourceUrl('');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Upload Photo for {placeName}</h3>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('url')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            mode === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          From URL
        </button>
        <button
          onClick={() => setMode('file')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            mode === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
        </button>
      </div>

      {/* URL Upload Form */}
      {mode === 'url' && (
        <form onSubmit={handleUrlUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Direct link to CC-licensed image (e.g., from Wikimedia Commons, Flickr)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Author / Credit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Photographer name"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              License <span className="text-red-500">*</span>
            </label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="CC-BY-4.0">CC-BY-4.0</option>
              <option value="CC-BY-3.0">CC-BY-3.0</option>
              <option value="CC-BY-SA-4.0">CC-BY-SA-4.0</option>
              <option value="CC-BY-SA-3.0">CC-BY-SA-3.0</option>
              <option value="CC0">CC0 / Public Domain</option>
              <option value="Public Domain">Public Domain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Source Page URL
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://commons.wikimedia.org/wiki/File:..."
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Link to the original source page (for attribution)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 p-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      )}

      {/* File Upload Form */}
      {mode === 'file' && (
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Image File <span className="text-red-500">*</span>
            </label>
            <input
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, or WebP. Minimum 1200×600px. Max 10MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Author / Credit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Photographer name"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              License <span className="text-red-500">*</span>
            </label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="CC-BY-4.0">CC-BY-4.0</option>
              <option value="CC-BY-3.0">CC-BY-3.0</option>
              <option value="CC-BY-SA-4.0">CC-BY-SA-4.0</option>
              <option value="CC-BY-SA-3.0">CC-BY-SA-3.0</option>
              <option value="CC0">CC0 / Public Domain</option>
              <option value="Public Domain">Public Domain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Source Page URL
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 p-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Only upload images with allowed licenses (CC-BY, CC-BY-SA, CC0, Public Domain).
          Always provide proper attribution.
        </p>
      </div>
    </div>
  );
}
