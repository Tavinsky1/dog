"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLACE_CATEGORIES, getAllGroupsOrdered, getCategoriesByGroup } from "@/lib/categories";

interface FormData {
  name: string;
  type: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  websiteUrl: string;
  phone: string;
  amenities: string[];
  rules: string;
  imageUrl: string;
  latitude: string;
  longitude: string;
  // Dog-specific attributes
  dogSizeAllowed: string;
  hasWaterBowl: boolean;
  offLeashAllowed: boolean;
  hasOutdoorSeating: boolean;
  petFee: string;
  maxDogsAllowed: string;
}

export default function PlaceSubmissionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    city: "",
    shortDescription: "",
    fullDescription: "",
    websiteUrl: "",
    phone: "",
    amenities: [],
    rules: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    // Dog-specific attributes
    dogSizeAllowed: "",
    hasWaterBowl: false,
    offLeashAllowed: false,
    hasOutdoorSeating: false,
    petFee: "",
    maxDogsAllowed: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          imageUrl = url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Submit place data
      const submitData = {
        ...formData,
        imageUrl,
        lat: formData.latitude ? parseFloat(formData.latitude) : undefined,
        lng: formData.longitude ? parseFloat(formData.longitude) : undefined,
        // Dog-specific attributes - only include if set
        dogSizeAllowed: formData.dogSizeAllowed || undefined,
        hasWaterBowl: formData.hasWaterBowl || undefined,
        offLeashAllowed: formData.offLeashAllowed || undefined,
        hasOutdoorSeating: formData.hasOutdoorSeating || undefined,
        petFee: formData.petFee || undefined,
        maxDogsAllowed: formData.maxDogsAllowed ? parseInt(formData.maxDogsAllowed) : undefined,
      };

      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit place");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 p-8 bg-green-50 rounded-2xl border border-green-200">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-green-800">Place Submitted!</h2>
        <p className="text-green-700">
          Thank you for contributing to the DogAtlas community. Your submission will be reviewed by our moderators.
        </p>
        <p className="text-sm text-green-600">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Place Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Central Park Dog Run"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Place category"
            >
              <option value="">Select a category</option>
              {getAllGroupsOrdered().map((group) => (
                <optgroup key={group.id} label={group.name}>
                  {getCategoriesByGroup(group.id).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Berlin"
          />
        </div>

        {/* Location Coordinates */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Location</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 52.5200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 13.4050"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            💡 Tip: You can find coordinates by right-clicking on Google Maps and selecting "What's here?"
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Photo</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Place Image
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      handleInputChange("imageUrl", "");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Or provide an image URL below if you don't want to upload a file
              </p>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Short Description *
          </label>
          <textarea
            required
            value={formData.shortDescription}
            onChange={(e) => handleInputChange("shortDescription", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description of why this place is great for dogs"
            maxLength={200}
          />
          <p className="text-sm text-slate-500 mt-1">
            {formData.shortDescription.length}/200 characters
          </p>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Description
          </label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) => handleInputChange("fullDescription", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            placeholder="Detailed description, tips for dog owners, what to expect, etc."
            maxLength={1000}
          />
          <p className="text-sm text-slate-500 mt-1">
            {formData.fullDescription.length}/1000 characters
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rules or Special Notes
          </label>
          <textarea
            value={formData.rules}
            onChange={(e) => handleInputChange("rules", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any special rules or notes about dog access?"
          />
        </div>
      </div>

      {/* Dog-Specific Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          🐕 Dog-Specific Details
        </h2>
        <p className="text-sm text-slate-600">
          Help dog owners know what to expect. Only fill in what you know for certain.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dog Size Allowed
            </label>
            <select
              value={formData.dogSizeAllowed}
              onChange={(e) => handleInputChange("dogSizeAllowed", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Unknown / Not sure</option>
              <option value="all">All sizes welcome</option>
              <option value="small_only">Small dogs only (under 10kg)</option>
              <option value="small_medium">Small to medium dogs</option>
              <option value="large_ok">Large dogs OK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Dogs Allowed
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.maxDogsAllowed}
              onChange={(e) => handleInputChange("maxDogsAllowed", e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasWaterBowl}
              onChange={(e) => handleInputChange("hasWaterBowl", e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700">💧 Water bowl provided for dogs</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.offLeashAllowed}
              onChange={(e) => handleInputChange("offLeashAllowed", e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700">🐕 Off-leash allowed (in designated areas)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasOutdoorSeating}
              onChange={(e) => handleInputChange("hasOutdoorSeating", e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700">🌳 Outdoor/patio seating available</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pet Fee (if applicable)
          </label>
          <input
            type="text"
            value={formData.petFee}
            onChange={(e) => handleInputChange("petFee", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., €15/night, Free, Included"
          />
          <p className="text-xs text-slate-500 mt-1">
            For hotels, cafes, or places that charge for dogs
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Place for Review"}
        </button>
        <p className="text-sm text-slate-500 text-center mt-3">
          Your submission will be reviewed by our community moderators before being published.
        </p>
      </div>
    </form>
  );
}