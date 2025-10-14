/**
 * Feature Flags
 * 
 * Centralized feature flag management for progressive rollouts.
 * Flags can be controlled via environment variables for different environments.
 */

/**
 * Feature flags configuration
 */
export const featureFlags = {
  /**
   * Enable global map view (SVG world map + interactive markers)
   * Default: false (list view only)
   */
  enableMapView: process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === 'true',

  /**
   * Enable Mapbox integration for enhanced maps
   * Requires: NEXT_PUBLIC_MAPBOX_TOKEN
   * Default: false (use SVG map)
   */
  enableMapbox: process.env.NEXT_PUBLIC_ENABLE_MAPBOX === 'true',

  /**
   * Enable global search (across all countries/cities)
   * Default: true
   */
  enableGlobalSearch: process.env.NEXT_PUBLIC_ENABLE_GLOBAL_SEARCH !== 'false',

  /**
   * Use database instead of seed files for places
   * Default: false (use seed files)
   */
  useDatabase: process.env.NEXT_PUBLIC_USE_DATABASE === 'true',

  /**
   * Enable ISR (Incremental Static Regeneration)
   * Default: true in production, false in development
   */
  enableISR: process.env.NODE_ENV === 'production',

  /**
   * ISR revalidation period (seconds)
   * Default: 3600 (1 hour)
   */
  isrRevalidate: parseInt(process.env.NEXT_PUBLIC_ISR_REVALIDATE || '3600'),

  /**
   * Enable analytics tracking
   * Default: true in production
   */
  enableAnalytics: process.env.NODE_ENV === 'production',

  /**
   * Enable admin moderation features
   * Default: true
   */
  enableModeration: process.env.NEXT_PUBLIC_ENABLE_MODERATION !== 'false',
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature] as boolean;
}

/**
 * Get feature flag value
 */
export function getFeatureFlag<K extends keyof typeof featureFlags>(
  feature: K
): typeof featureFlags[K] {
  return featureFlags[feature];
}

/**
 * Runtime feature flag checks (client-side)
 */
export const clientFeatureFlags = {
  get enableMapView() {
    return typeof window !== 'undefined' && 
           window.localStorage.getItem('feature_map_view') === 'true' ||
           featureFlags.enableMapView;
  },
  
  get enableMapbox() {
    return typeof window !== 'undefined' &&
           window.localStorage.getItem('feature_mapbox') === 'true' ||
           featureFlags.enableMapbox;
  },
};

/**
 * Toggle a client-side feature flag (for testing)
 */
export function toggleClientFeature(feature: string, enabled: boolean) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`feature_${feature}`, enabled.toString());
  }
}

/**
 * Get all feature flags (useful for debugging)
 */
export function getAllFeatureFlags() {
  return {
    ...featureFlags,
    client: {
      mapView: clientFeatureFlags.enableMapView,
      mapbox: clientFeatureFlags.enableMapbox,
    },
  };
}

export default featureFlags;
