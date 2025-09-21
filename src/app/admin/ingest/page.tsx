"use client";

import { useState, useRef } from "react";
import RequireRole from "@/components/RequireRole";
import ProgressIndicator from "@/components/ProgressIndicator";

interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

interface IngestJob {
  id: string;
  filename: string;
  status: 'pending' | 'validating' | 'validated' | 'applying' | 'completed' | 'failed';
  createdAt: string;
  validationResult?: ValidationResult;
  appliedAt?: string;
  appliedBy?: string;
}

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentJob, setCurrentJob] = useState<IngestJob | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [applyProgress, setApplyProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // File type validation
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }

      // File size validation (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      // Minimum file size check (at least 1KB)
      if (selectedFile.size < 1024) {
        setError('File appears to be too small or empty');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setValidationResult(null);
      setCurrentJob(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    // Initialize upload progress
    setUploadProgress({ current: 0, total: file.size });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<Response>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress({ current: e.loaded, total: e.total });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = new Response(xhr.responseText, {
              status: xhr.status,
              statusText: xhr.statusText
            });
            resolve(response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/admin/ingest');
        xhr.send(formData);
      });

      const response = await uploadPromise;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setCurrentJob(result.job);
      setValidationResult(result.validationResult);
      setSuccess('File uploaded and validated successfully!');

      // Reset progress
      setUploadProgress({ current: 0, total: 0 });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress({ current: 0, total: 0 });
    } finally {
      setUploading(false);
    }
  };

  const handleApply = async () => {
    if (!currentJob || !validationResult) return;

    setApplying(true);
    setError(null);
    setSuccess(null);

    // Set up progress tracking
    const totalRows = validationResult.summary.validRows;
    setApplyProgress({ current: 0, total: totalRows });

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setApplyProgress(prev => {
        if (prev.current < prev.total) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
    }, 100);

    try {
      const response = await fetch(`/api/admin/ingest/${currentJob.id}/apply`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Apply failed');
      }

      const result = await response.json();
      setCurrentJob(result.job);

      // Complete progress
      setApplyProgress({ current: totalRows, total: totalRows });

      if (result.errors && result.errors.length > 0) {
        setError(`Applied ${result.appliedCount} places with ${result.errors.length} errors. Check console for details.`);
        console.error('Apply errors:', result.errors);
      } else {
        setSuccess(`Successfully applied ${result.appliedCount} places!`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apply failed');
    } finally {
      clearInterval(progressInterval);
      setApplying(false);
      setTimeout(() => setApplyProgress({ current: 0, total: 0 }), 2000);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCurrentJob(null);
    setValidationResult(null);
    setError(null);
    setSuccess(null);
    setUploadProgress({ current: 0, total: 0 });
    setApplyProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,type,city,latitude,longitude,short_description,full_description,image_url,website_url,phone,region,country,opening_hours,price_range,rating,amenities,tags
"Example Dog Park","park_offleash_area","berlin","52.5200","13.4050","A great off-leash area for dogs","This spacious park offers plenty of room for dogs to run and play freely. Features include water stations and waste disposal.","https://example.com/image.jpg","https://example.com","030-12345678","Berlin","Germany","6:00 AM - 10:00 PM","Free","4.5","water_bowls,waste_bags,fenced_area","dog_friendly_staff,off_leash_allowed"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dogatlas_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <RequireRole roles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">CSV Data Ingest</h1>
            <p className="mt-2 text-slate-600">Upload and validate place data from CSV files</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadTemplate}
              className="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              Download Template
            </button>
            <button
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {!currentJob && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Upload CSV File</h2>
              <p className="text-sm text-slate-600">Select a CSV file containing place data to upload and validate</p>
              <div className="mt-2 text-xs text-slate-500">
                Maximum file size: 10MB • Supported format: CSV with headers • Encoding: UTF-8
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CSV File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    aria-label="Select CSV file for upload"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-slate-600">
                      Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {uploading && uploadProgress.total > 0 && (
                  <div className="mb-4">
                    <ProgressIndicator
                      current={uploadProgress.current}
                      total={uploadProgress.total}
                      label="Uploading file"
                      status="processing"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload & Validate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Preview */}
        {file && !currentJob && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">File Preview</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">File Details</div>
                  <div className="text-sm text-slate-600">
                    <div>Name: {file.name}</div>
                    <div>Size: {(file.size / 1024).toFixed(1)} KB</div>
                    <div>Type: {file.type || 'text/csv'}</div>
                    <div>Last Modified: {new Date(file.lastModified).toLocaleString()}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Processing Info</div>
                  <div className="text-sm text-slate-600">
                    <div>Expected Format: CSV with headers</div>
                    <div>Validation: Schema + Database checks</div>
                    <div>Duplicate Handling: Update existing records</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Results */}
        {validationResult && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Validation Results</h2>
                <div className="flex items-center space-x-2">
                  {validationResult.isValid ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      ✓ Ready to Apply
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      ✗ Validation Failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="text-2xl font-bold text-green-800">{validationResult.summary.validRows}</div>
                  <div className="text-sm text-green-700">Valid Rows</div>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="text-2xl font-bold text-red-800">{validationResult.summary.invalidRows}</div>
                  <div className="text-sm text-red-700">Invalid Rows</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-slate-800">{validationResult.summary.totalRows}</div>
                  <div className="text-sm text-slate-700">Total Rows</div>
                </div>
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Errors ({validationResult.errors.length})</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {validationResult.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="text-sm text-red-800">
                          <strong>Row {error.row}:</strong> {error.field} - {error.message}
                        </div>
                      </div>
                    ))}
                    {validationResult.errors.length > 10 && (
                      <div className="text-sm text-red-600 text-center py-2">
                        ... and {validationResult.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Warnings ({validationResult.warnings.length})</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {validationResult.warnings.slice(0, 5).map((warning, index) => (
                      <div key={index} className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                        <div className="text-sm text-yellow-800">
                          <strong>Row {warning.row}:</strong> {warning.field} - {warning.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Progress */}
              {applying && applyProgress.total > 0 && (
                <div className="mb-6">
                  <ProgressIndicator
                    current={applyProgress.current}
                    total={applyProgress.total}
                    label="Applying places to database"
                    status="processing"
                  />
                </div>
              )}

              {/* Apply Button */}
              {validationResult.isValid && (
                <div className="flex justify-end">
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Applying...' : `Apply ${validationResult.summary.validRows} Places`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Status */}
        {currentJob && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Job Status</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{currentJob.filename}</p>
                  <p className="text-sm text-slate-600">
                    Created: {new Date(currentJob.createdAt).toLocaleString()}
                  </p>
                  {currentJob.appliedAt && (
                    <p className="text-sm text-slate-600">
                      Applied: {new Date(currentJob.appliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  currentJob.status === 'completed' ? 'bg-green-100 text-green-800' :
                  currentJob.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {currentJob.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CSV Format Help */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">CSV Format Requirements</h2>
          </div>

          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <p>Your CSV file should contain the following columns:</p>
              <ul>
                <li><strong>name</strong> - Place name (required)</li>
                <li><strong>type</strong> - Place type (required, see valid types below)</li>
                <li><strong>city</strong> - City name or slug (required)</li>
                <li><strong>latitude</strong> - Latitude coordinate (required)</li>
                <li><strong>longitude</strong> - Longitude coordinate (required)</li>
                <li><strong>short_description</strong> - Brief description (optional)</li>
                <li><strong>full_description</strong> - Detailed description (optional)</li>
                <li><strong>image_url</strong> - Image URL (optional)</li>
                <li><strong>website_url</strong> - Website URL (optional)</li>
                <li><strong>phone</strong> - Phone number (optional)</li>
              </ul>

              <p className="mt-4"><strong>Valid place types:</strong></p>
              <div className="text-xs font-mono bg-slate-50 p-3 rounded-lg">
                park_offleash_area, park_onleash_area, trail_hiking, trail_walking, beach_dog_friendly,
                lake_dog_friendly, cafe_dog_friendly, restaurant_dog_friendly, brewery_dog_friendly,
                vet_clinic, vet_emergency, grooming_salon, grooming_mobile, pet_store, doggy_daycare,
                dog_training, hotel_pet_friendly, hostel_pet_friendly, apartment_pet_friendly,
                dog_park_event, dog_training_class, dog_meetup, pet_expo, dog_spa, pet_photography,
                dog_taxi, pet_cemetery
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}