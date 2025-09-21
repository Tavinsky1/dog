// Accessibility utilities for WCAG 2.2 AA compliance

export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export function getAriaLabel(element: string, context?: string): string {
  const labels: Record<string, string> = {
    'favorite-button': 'Toggle favorite',
    'rating-star': 'Rate this place',
    'map-marker': 'View place details',
    'search-input': 'Search for dog-friendly places',
    'filter-button': 'Filter places by category',
    'menu-toggle': 'Toggle navigation menu',
    'close-dialog': 'Close dialog',
    'submit-form': 'Submit form',
    'upload-file': 'Upload file',
    'download-template': 'Download CSV template',
  }

  const base = labels[element] || element.replace(/-/g, ' ')
  return context ? `${base} for ${context}` : base
}

export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // Calculate relative luminance
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function validateColorContrast(
  foreground: string,
  background: string,
  size: 'normal' | 'large' = 'normal'
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(foreground, background)
  const required = size === 'large' ? 3 : 4.5 // WCAG AA standards

  return {
    passes: ratio >= required,
    ratio,
    required
  }
}

export function createAriaLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const liveRegion = document.createElement('div')
  liveRegion.setAttribute('aria-live', priority)
  liveRegion.setAttribute('aria-atomic', 'true')
  liveRegion.className = 'sr-only'
  liveRegion.textContent = message

  document.body.appendChild(liveRegion)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion)
  }, 1000)
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  // Focus first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  createAriaLiveRegion(message, priority)
}

export const a11yProps = {
  button: (label: string, expanded?: boolean) => ({
    'aria-label': label,
    'aria-expanded': expanded,
    role: 'button',
    tabIndex: 0,
  }),

  link: (label: string, external?: boolean) => ({
    'aria-label': label,
    ...(external && {
      'aria-describedby': 'external-link-desc',
      rel: 'noopener noreferrer',
      target: '_blank',
    }),
  }),

  modal: (title: string, describedBy?: string) => ({
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': title,
    ...(describedBy && { 'aria-describedby': describedBy }),
  }),

  form: (title: string, invalid?: boolean) => ({
    'aria-label': title,
    'aria-invalid': invalid,
    role: 'form',
  }),

  status: (message: string, live: 'polite' | 'assertive' = 'polite') => ({
    role: 'status',
    'aria-live': live,
    'aria-atomic': 'true',
    children: message,
  }),
}