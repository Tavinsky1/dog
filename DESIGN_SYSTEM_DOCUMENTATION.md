# DogAtlas Design System Documentation

## Overview
DogAtlas is a clean, modern web application for dog-friendly places. The design emphasizes **readability, trust, and warmth** while maintaining a professional look suitable for travelers and local dog owners.

---

## 🎨 Complete CSS Files

### 1. globals.css (Main Stylesheet)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-gray-50 text-slate-700 font-sans;
    font-family: var(--font-inter, 'Inter'), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold text-slate-900;
    font-family: var(--font-nunito, 'Nunito'), var(--font-inter, 'Inter'), sans-serif;
  }

  .font-display {
    font-family: var(--font-nunito, 'Nunito'), var(--font-inter, 'Inter'), sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-blue-700 rounded-full bg-white border border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-colors;
  }

  .btn-danger {
    @apply inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-red-600 hover:bg-red-700 transition-colors;
  }

  .card {
    @apply bg-white border border-slate-200 rounded-2xl;
  }

  .card-hover {
    @apply card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
  }

  .heading-lg {
    @apply text-3xl font-display font-bold text-slate-900;
  }

  .heading-md {
    @apply text-2xl font-display font-bold text-slate-900;
  }
}

/* Map helpers */
.map-container {
  height: 100vh;
  width: 100%;
}

.maplibregl-marker {
  cursor: pointer;
}

/* Photo upload grid */
.photo-upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.photo-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
}

/* Filters */
.filter-checkbox:checked + label {
  @apply bg-blue-100 border-blue-500;
}

/* Loading indicator */
.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive map */
@media (max-width: 768px) {
  .map-container {
    height: 50vh;
  }
}

/* Form helpers */
.form-input {
  @apply w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y;
}

.maplibregl-popup-content {
  padding: 1rem;
  max-width: 320px;
}

.maplibregl-popup-close-button {
  font-size: 18px;
  padding: 4px;
}

@media (max-width: 640px) {
  .maplibregl-popup-content {
    max-width: 260px;
    padding: 0.75rem;
  }
}

/* Hide Next.js/Turbopack development indicators */
#webpack-dev-server-client-overlay,
#webpack-dev-server-client-overlay-div,
nextjs-portal,
[data-nextjs-dialog-overlay],
[data-nextjs-toast],
.__next-dev-tools__,
.__next-build-watcher__,
[data-nextjs-static-indicator] {
  display: none !important;
}
```

### 2. tailwind.config.js (Design Tokens)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Nunito', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        gray: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0) 70%)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ],
};
```

---

## 📐 Design System Breakdown

### Color Palette

#### Primary Colors (Blues)
- **Blue-600** (`#2563eb`): Primary action color - buttons, links, CTAs
- **Blue-700** (`#1d4ed8`): Hover states for primary actions
- **Blue-100** (`#dbeafe`): Light blue backgrounds for secondary elements
- **Blue-50** (`#eff6ff`): Very light blue for subtle highlights

**Usage**: Navigation, buttons, interactive elements, brand identity

#### Neutral Colors (Grays & Slates)
- **Gray-50** (`#f8fafc`): Page background
- **Slate-700** (`#334155`): Body text
- **Slate-900** (`#0f172a`): Headings and important text
- **Slate-200** (`#e2e8f0`): Borders and dividers
- **White** (`#ffffff`): Card backgrounds, content areas

**Usage**: Text hierarchy, backgrounds, borders, subtle UI elements

#### Accent Colors (Amber/Orange)
- **Amber-400** (`#fbbf24`): Badges, highlights, featured items
- **Amber-900** (`#78350f`): Dark amber text for contrast
- **Orange-500** (`#f97316`): Energy and emphasis

**Usage**: Category badges, featured content, special indicators

#### Alert Colors
- **Red-600** (`#dc2626`): Danger actions, destructive operations
- **Red-700** (`#b91c1c`): Danger hover states

**Usage**: Delete buttons, warnings, errors

---

### Typography

#### Font Families
1. **Inter** (Body Font)
   - Clean, modern sans-serif
   - Used for: Body text, descriptions, UI labels
   - Weight: Regular (400), Medium (500), Semibold (600)

2. **Nunito** (Display Font)
   - Friendly, rounded sans-serif
   - Used for: Headings (h1-h6), hero text, section titles
   - Weight: Bold (700), Extra Bold (800)

#### Font Sizes & Hierarchy
- **Heading Large (heading-lg)**: 3xl (30px), Bold, Slate-900
- **Heading Medium (heading-md)**: 2xl (24px), Bold, Slate-900
- **Body Text**: sm/base (14-16px), Regular, Slate-700
- **Small Text**: xs (12px), Regular, Slate-600

---

### Component Styles

#### Buttons

**Primary Button (btn-primary)**
```
- Background: Blue-600
- Text: White
- Shape: Rounded-full (pill shape)
- Padding: px-5 py-2.5
- Hover: Blue-700
- Shadow: sm
- Transition: colors
```

**Secondary Button (btn-secondary)**
```
- Background: White
- Text: Blue-700
- Border: Blue-100
- Shape: Rounded-full
- Hover: Blue-50 background, Blue-200 border
- Transition: colors
```

**Danger Button (btn-danger)**
```
- Background: Red-600
- Text: White
- Shape: Rounded-full
- Hover: Red-700
```

#### Cards

**Standard Card (.card)**
```
- Background: White
- Border: Slate-200 (1px)
- Border-radius: 2xl (16px)
```

**Hover Card (.card-hover)**
```
- Base: Standard card
- Shadow: sm → lg on hover
- Transform: Translate up slightly (-2px)
- Transition: all 200ms
```

**Usage**: Place cards, content containers, information panels

#### Forms

**Input Fields (.form-input)**
```
- Border: Slate-300
- Border-radius: md (6px)
- Focus: Blue-500 ring (2px)
- Padding: px-3 py-2
```

**Textarea (.form-textarea)**
```
- Same as input
- Resizable: Vertical only
```

---

### Layout Structure

#### Header (Sticky Navigation)
```
- Position: Sticky top
- Background: White/80 with backdrop-blur
- Border-bottom: Slate-200
- Height: 64px (h-16)
- Z-index: 40
```

**Contains:**
- Logo (Blue-700, 🐕 emoji in blue-600 circle)
- City dropdown selector
- Navigation links
- User role badge (if applicable)
- Sign in/out button

#### Main Content Area
```
- Max-width: 6xl (1152px)
- Padding: px-4 sm:px-6 lg:px-8
- Padding-top: py-12
- Background: Gray-50
```

#### Footer
```
- Background: White
- Border-top: Slate-200
- Padding: py-8
- Text: Slate-500, text-sm
```

---

### Page-Specific Styles

#### Home/City Pages

**Category Cards (Grid Layout)**
```
- Grid: 3 columns on large screens, 1-2 on mobile
- Gap: gap-6
- Cards: Large with image backgrounds
- Overlay: Gradient from-black/60
- Badges: Amber-400 background for count indicators
```

**Place Cards (List View)**
```
- Background: White
- Border: Slate-200
- Border-radius: 3xl (24px)
- Shadow: sm → lg on hover
- Image: h-80 (320px), object-cover
- Hover: Lift up slightly with shadow increase
```

#### Place Detail Pages

**Hero Image Section**
```
- Height: 80 (320px) on mobile, 96 (384px) on desktop
- Background: Slate-100 (placeholder)
- Image: object-cover, full width/height
- Overlay: Gradient from-black/50 for text contrast
```

**Content Layout**
```
- Grid: 2fr (content) + 1fr (sidebar) on large screens
- Gap: gap-8
- Padding: p-6 lg:p-10
```

**Sidebar (Quick Facts)**
```
- Background: Slate-50
- Border: Slate-200
- Border-radius: 2xl (16px)
- Padding: p-6
```

**Amenities Display**
```
- Grid: 2 columns
- Items: Blue-50/60 background with Blue-100 border
- Icon: ✅ emoji
- Text: Blue-800
```

**Tags**
```
- Style: Pills with Slate-200 border
- Text: Uppercase, xs size, tracking-wide
- Color: Slate-600
```

#### Map Pages

**Full-screen Map**
```
- Height: 100vh
- Width: 100%
- Markers: Custom cursor pointer
- Popups: Max-width 320px, padding 1rem
```

**Map Controls**
```
- Position: Absolute top-2 left-2
- Background: White/90 with backdrop-blur
- Border-radius: lg
- Shadow: md
```

---

### Interactive Elements

#### Hover States
- **Cards**: Shadow increase + slight lift (-2px)
- **Buttons**: Color darkening + smooth transition
- **Links**: Color change to Blue-600
- **Images**: Slight scale on hover (optional)

#### Focus States
- **Inputs**: Blue-500 ring (2px) with offset
- **Buttons**: Blue-500 outline
- **Links**: Blue-500 outline

#### Active States
- **Buttons**: Slight press effect (scale 0.98)
- **Checkboxes**: Blue-100 background with Blue-500 border

---

### Spacing System

#### Consistent Spacing Scale
```
- gap-2: 8px
- gap-3: 12px
- gap-4: 16px
- gap-6: 24px
- gap-8: 32px

- p-4: 16px padding
- p-6: 24px padding
- p-8: 32px padding
- p-10: 40px padding
```

#### Section Spacing
- Between sections: space-y-8 or space-y-16
- Within sections: space-y-3 or space-y-4
- Card padding: p-6 on mobile, p-10 on desktop

---

### Shadows & Depth

```
- shadow-sm: Subtle (cards at rest)
- shadow-md: Medium (elevated cards, dropdowns)
- shadow-lg: Large (hover states, modals)
- shadow-xl: Extra large (overlays)
- shadow-2xl: Maximum (dialogs)
```

**Shadow Colors**: All shadows use black with low opacity (7-25%)

---

### Border Radius System

```
- rounded-md: 6px (inputs)
- rounded-lg: 8px (small cards)
- rounded-xl: 12px (medium cards)
- rounded-2xl: 16px (large cards, sections)
- rounded-3xl: 24px (hero images, feature cards)
- rounded-full: Pill shape (buttons, badges)
```

---

### Animations & Transitions

#### Transitions
```
- transition-colors: 150ms (buttons, links)
- transition-all duration-200: 200ms (cards)
- ease-in-out: Default easing
```

#### Animations
```
- Spin (loading): 1s linear infinite rotation
- Hover lift: -2px translate on Y-axis
- Fade in: Opacity 0 → 1
```

---

### Responsive Breakpoints

```
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)
```

**Responsive Behavior:**
- **Header**: Horizontal layout always, compact on mobile
- **Grids**: 1 column → 2 columns → 3 columns
- **Content**: Full width → centered with max-width
- **Images**: Stack on mobile, side-by-side on desktop
- **Maps**: 50vh on mobile, 100vh on desktop

---

### Visual Characteristics

#### Overall Feel
- **Clean & Modern**: Minimal decoration, focus on content
- **Friendly & Approachable**: Rounded corners, warm accent colors
- **Professional**: Consistent spacing, clear hierarchy
- **Trustworthy**: Blue primary color, organized layout
- **Accessible**: Good contrast ratios, readable fonts

#### Design Philosophy
1. **Content First**: Images and descriptions are prominent
2. **Easy Navigation**: Clear CTAs, intuitive structure
3. **Visual Hierarchy**: Headings → body → metadata
4. **Whitespace**: Generous spacing prevents crowding
5. **Consistency**: Reusable components, predictable patterns

#### Brand Identity
- **Dog-friendly**: Warm, welcoming, pet-focused
- **Travel-oriented**: Clean, organized, informative
- **Community-driven**: Reviews, ratings, user contributions
- **Modern**: Contemporary design trends, good UX

---

## 🎯 Key Visual Elements

### Logo & Branding
- **Logo**: 🐕 emoji in blue-600 circle + "DogAtlas" text
- **Primary Brand Color**: Blue-600
- **Accent**: Amber-400 for highlights

### Imagery Style
- **Place Photos**: Real photography, object-cover
- **Aspect Ratios**: 16:9 for cards, 4:3 for detail pages
- **Image Treatment**: Subtle overlays for text readability

### Iconography
- **Style**: Simple emojis and unicode symbols
- **Usage**: Category indicators, amenities, ratings
- **Size**: Proportional to surrounding text

---

## 💡 Suggestions for AI Analysis

When reviewing this design with AI, consider:

1. **Color Harmony**: Is the blue/amber/gray palette cohesive?
2. **Visual Hierarchy**: Does the eye flow naturally through content?
3. **Whitespace**: Is spacing too tight or too loose?
4. **Contrast**: Are text and backgrounds readable?
5. **Modern Trends**: What's missing from contemporary designs?
6. **Emotional Impact**: Does it feel welcoming for dog owners?
7. **Differentiation**: How does it compare to competitors like TripAdvisor or Yelp?
8. **Call-to-Actions**: Are buttons prominent enough?
9. **Mobile Experience**: Does it work well on smaller screens?
10. **Accessibility**: WCAG compliance for colors and interactions?

---

## 📊 Current Design Strengths

✅ Clean, uncluttered layout
✅ Consistent spacing and sizing
✅ Good use of whitespace
✅ Professional color palette
✅ Responsive design
✅ Clear typography hierarchy
✅ Smooth transitions and hover states

## 🔄 Potential Areas for Enhancement

Consider asking AI about:
- More dynamic or gradient backgrounds
- Illustration or icon system
- Enhanced photography treatments
- Unique visual elements for dog-friendliness
- More playful accent colors
- Micro-interactions and animations
- Distinctive brand personality
- Premium/modern design trends (glassmorphism, etc.)

---

**Last Updated**: October 8, 2025
**Version**: 1.0 (Post-consolidation, post-image-enhancement)
