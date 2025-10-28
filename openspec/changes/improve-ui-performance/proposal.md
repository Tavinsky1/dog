# Proposal: Improve UI Performance & User Experience

**Change ID:** `improve-ui-performance`  
**Status:** DRAFT  
**Created:** 2025-10-28  
**Priority:** HIGH

## Problem Statement

Current UI has several performance and usability issues:
- Images load slowly without placeholders (poor perceived performance)
- No loading states create confusion (is it working?)
- Missing copy/share functionality reduces engagement
- No visual feedback for long-running operations

## Proposed Solution

Implement key UI/UX improvements:

### 1. **Lazy Loading for Images**
- Use Next.js Image component with blur placeholders
- Implement intersection observer for below-fold images
- Add low-quality image placeholders (LQIP)
- Progressive image loading

### 2. **Skeleton Screens**
- Place cards loading state
- Place detail page skeleton
- Review list skeleton
- Map loading skeleton

### 3. **Copy Address Feature**
- One-click copy to clipboard
- Visual feedback (toast notification)
- Fallback for unsupported browsers

### 4. **Share Functionality**
- Native share API for mobile
- Fallback social share buttons
- Copy link to clipboard
- Share to WhatsApp, Facebook, Twitter

## Implementation Details

### Image Optimization:
```typescript
// Generate blur data URL at build time
import { getPlaiceholder } from 'plaiceholder'

// Use in Image component
<Image
  src={place.image}
  alt={place.name}
  placeholder="blur"
  blurDataURL={blurDataURL}
  loading="lazy"
/>
```

### Skeleton Components:
```tsx
// Reusable skeleton primitives
<Skeleton variant="text" width="80%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" height={200} />
```

### Share Implementation:
```typescript
// Native share with fallback
if (navigator.share) {
  await navigator.share({
    title: place.name,
    text: place.description,
    url: window.location.href
  })
} else {
  // Show share modal with social buttons
}
```

## Success Criteria

- [ ] All images have blur placeholders
- [ ] Images lazy load when scrolling
- [ ] Skeleton screens show during data fetching
- [ ] Copy address works on all browsers
- [ ] Share button works on mobile and desktop
- [ ] Lighthouse performance score > 90
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

## Performance Targets

**Current State:**
- LCP: ~4.5s
- FID: ~150ms
- CLS: 0.25

**Target State:**
- LCP: <2.5s (Good)
- FID: <100ms (Good)
- CLS: <0.1 (Good)

## Implementation Priority

**Week 1 (Critical):**
1. Image lazy loading
2. Basic skeleton screens
3. Copy address
4. Share functionality

**Week 2 (Nice to have):**
1. Advanced skeletons for all components
2. Image blur placeholders
3. Optimized image sizes
4. Additional loading states

## Technical Considerations

### Image Formats:
- WebP for modern browsers
- AVIF for cutting-edge browsers
- JPEG fallback for compatibility
- Responsive srcset for different screen sizes

### Bundle Size:
- Keep skeleton components minimal (<5KB)
- Use CSS animations over JS
- Tree-shake unused utilities
- Lazy load share functionality

## Dependencies

- `plaiceholder` for blur placeholders
- `react-intersection-observer` for lazy loading
- Native Web Share API (no dependency)
- Toast notification library (existing or add `react-hot-toast`)

## Timeline

- Day 1-2: Image optimization and lazy loading
- Day 3: Skeleton screens
- Day 4: Copy and share features
- Day 5: Testing and refinement
