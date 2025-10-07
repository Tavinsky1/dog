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
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

        <div className="grid md:grid-cols-2 gap-6">
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