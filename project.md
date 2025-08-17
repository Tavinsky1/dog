## Recent Additions / Checklist

- [x] Session helper (`src/lib/session.ts`)
- [x] Moderation reject endpoint (POST `/api/moderation/[id]/reject`)
- [x] Place page SEO: `generateMetadata` + JSON-LD
- [x] Category page SEO: `generateMetadata`
- [x] Optional: sitemap at `/sitemap.xml` (added)
- [x] robots.txt via app/robots.ts
- [x] Category tabs: List/Map
- [x] Place JSON-LD includes Review items
- [x] **Manus UI/UX Redesign Implementation** 🎨
- [x] **Enhanced Category Navigation** 📋
- [x] **Locations Dropdown Menu** 🌍
- [x] **Improved User Experience** ✨

## ✨ Latest Updates (August 2025)

### 🎨 Manus UI/UX Redesign
- **Modern Design System**: Implemented orange/amber color palette with glassmorphism effects
- **Hero Section**: Redesigned with compelling dog-themed branding and CTAs
- **Category Cards**: Enhanced with hover animations, gradient overlays, and descriptive subtitles
- **Navigation**: Upgraded header with responsive design and authentication integration
- **Typography**: Applied Nunito font for headings with Inter for body text
- **Visual Hierarchy**: Improved spacing, shadows, and component layouts

### 📋 Enhanced Category Cards
- **Descriptive Subtitles**: Added clear descriptions to all category cards:
  - "Paws & Patios" → "Dog-friendly cafés, restaurants & bars with outdoor seating"
  - "Parks & Play" → "Off-leash areas, dog parks & recreational spaces"  
  - "Splash & Swim" → "Lakes, beaches & swimming spots for water-loving dogs"
  - "Trails & Treks" → "Hiking trails, forest paths & scenic walking routes"
- **Consistent Messaging**: Applied descriptive text across homepage and city pages
- **Better User Understanding**: Users now clearly understand what each category contains

### 🔄 Improved Navigation
- **Back Button**: Added navigation back to city overview from category pages
- **Breadcrumb-style Navigation**: Clear visual hierarchy for user orientation
- **Smooth Transitions**: Enhanced hover states and animations

### 🌍 Locations Dropdown Menu
- **Scalable Architecture**: Replaced single "Berlin" link with dropdown menu system
- **Future-Ready**: Easy addition of new cities (Munich, Paris, London, etc.)
- **Visual Indicators**: Country flags and intuitive grouping
- **Expandable Design**: "More cities coming soon" messaging for growth

### 🛠️ Technical Improvements
- **Component Architecture**: Created modular LocationsDropdown and HeaderWrapper components
- **Type Safety**: Maintained full TypeScript compliance throughout redesign
- **Performance**: Optimized component rendering and state management
- **Responsive Design**: Mobile-first approach with proper breakpoints
# 🐕 DogAtlas Project Documentation

## Project Overview

DogAtlas is a comprehensive web application for discovering, reviewing, and managing dog-friendly places. Built with Next.js 15, it provides an interactive map interface for finding parks, cafes, and other locations w### UI/UX Design

### Manus Design System (Current Implementation)
- **Brand Colors**: Orange/amber color palette (#f97316 primary) with warm, welcoming tones
- **Typography**: Nunito font for headings (extrabold), Inter for body text with excellent readability
- **Visual Effects**: Glassmorphism with backdrop blur, gradient backgrounds, soft shadows
- **Components**: Modern card designs with hover animations and smooth transitions
- **Interactive Elements**: Enhanced hover states, loading animations, and micro-interactions

### Visual Identity
- **Color Palette**: 
  - Primary: Orange (#f97316) and Amber (#f59e0b) for warmth and friendliness
  - Text: Gray-800 (#1f2937) for high contrast and readability  
  - Backgrounds: Gradient overlays (amber-50 to orange-50) for visual depth
  - Accents: White/transparent overlays with backdrop blur effects
- **Shadows**: Sophisticated shadow system for depth and hierarchy
- **Border Radius**: Consistent rounded corners (1rem for cards, 2xl for heroes)
- **Dog-Themed Elements**: Paw prints, dog emojis, and pet-friendly iconography

### Enhanced User Experience
- **Category Clarity**: Descriptive subtitles eliminate confusion about category contents
- **Navigation Flow**: Clear back buttons and breadcrumb-style navigation
- **Scalable Locations**: Dropdown menu architecture supports global expansion
- **Visual Feedback**: Improved hover states and loading indicators
- **Mobile Optimization**: Touch-friendly interfaces with proper spacing

### Component Improvements
- **Hero Component**: Eye-catching design with compelling CTAs and dog branding
- **CategoryCard**: Enhanced with descriptions, hover effects, and count badges
- **LocationsDropdown**: Modern dropdown with flags and expandable architecture
- **HeaderWrapper**: Responsive navigation with authentication integration
- **Footer**: Clean, minimal design with proper branding consistency

### Responsive Design
- **Mobile First**: Optimized for mobile devices with touch-friendly interfaces
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid Layouts**: Flexible grid systems that adapt to screen size
- **Touch Targets**: Minimum 44px touch targets for accessibility
- **Navigation**: Responsive header with mobile-optimized menu

### Component Library
- **Hero Component**: Gradient backgrounds with call-to-action sections
- **PlaceCard**: Clean card design with hover effects and badge system
- **Header**: Sticky navigation with backdrop blur and role indicators
- **Footer**: Minimal footer with legal links and branding
- **Map Integration**: Custom markers with hover states and popups

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Readers**: ARIA labels and descriptions where needed
- **Color Contrast**: WCAG AA compliant color combinations
- **Loading States**: Animated skeletons and loading indicatorsme.

## 🚀 Features

### Core Features
- **Interactive Maps**: MapLibre GL-powered maps showing dog-friendly locations
- **Place Discovery**: Search and filter places by various features (off-leash areas, water access, etc.)
- **Review System**: User-generated reviews with star ratings
- **Photo Uploads**: S3-powered photo sharing with presigned URLs
- **Authentication**: Magic link email authentication via NextAuth
- **Role-based Access**: USER, MOD, and ADMIN roles with different permissions
- **Moderation Queue**: Content moderation system for reviews and submissions

### Advanced Features
- **Geospatial Search**: Distance-based place discovery
- **Feature Filtering**: Multi-faceted filtering (fenced areas, parking, cafes, etc.)
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: Dynamic content updates
- **Leaderboard**: User contribution tracking
- **City-specific Views**: Dedicated pages for different cities (Berlin implemented)

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS with react-map-gl
- **Authentication**: NextAuth.js v4
- **HTTP Client**: Native fetch API

### Backend Stack
- **Runtime**: Node.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.14.0
- **File Storage**: AWS S3
- **Email**: SMTP (configurable provider)

### Database Schema
```
User (id, email, name, role, createdAt)
Place (id, name, description, latitude, longitude, city, status, features)
Review (id, placeId, userId, rating, body, tags, status)
Photo (id, url, placeId, userId, createdAt)
PlaceFeature (id, placeId, key, value)
Submission (id, type, payload, placeId, userId, status)
```

## 📁 Project Structure

```
DOG ATLAS/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── places/        # Places CRUD API
│   │   │   ├── reviews/       # Review submission API
│   │   │   ├── photos/        # Photo upload API
│   │   │   └── submissions/   # Moderation API
│   │   ├── berlin/            # Berlin city page
│   │   ├── places/[id]/       # Individual place pages
│   │   ├── leaderboard/       # User leaderboard
│   │   ├── mod/               # Moderation interface
│   │   ├── signin/            # Sign-in page
│   │   ├── privacy/           # Privacy policy
│   │   ├── tos/               # Terms of service
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation header (legacy)
│   │   ├── HeaderWrapper.tsx  # **NEW**: Modern header with locations dropdown
│   │   ├── LocationsDropdown.tsx # **NEW**: Scalable city selection menu
│   │   ├── Footer.tsx         # Site footer
│   │   ├── Hero.tsx           # **UPDATED**: Manus-styled hero component
│   │   ├── CategoryCard.tsx   # **UPDATED**: Enhanced with descriptions & animations
│   │   ├── Stat.tsx           # Statistics display component
│   │   ├── PlaceCard.tsx      # Place listing cards
│   │   ├── SearchInput.tsx    # Search functionality
│   │   ├── Filters.tsx        # Map filtering interface
│   │   ├── PhotoUpload.tsx    # S3 photo upload
│   │   ├── RequireRole.tsx    # Role-based access control
│   │   └── Providers.tsx      # Context providers
│   └── lib/                   # Utility libraries
│       ├── auth.ts            # NextAuth configuration
│       ├── session.ts         # Session management
│       ├── geo.ts             # Geospatial utilities
│       ├── points.ts          # Point calculation
│       └── schemas.ts         # Zod validation schemas
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── scripts/                   # Utility scripts
│   ├── seed.ts                # Database seeding
│   ├── create_admin.ts        # Admin user creation
│   ├── setup_db.sh            # Database setup automation
│   ├── fix_postgres_auth.sh   # PostgreSQL auth configuration
│   ├── grant_schema_permissions.sh  # Database permissions
│   └── verify.sh              # System verification
├── types/
│   └── next-auth.d.ts         # NextAuth type extensions
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── docker-compose.yml         # Docker services (optional)
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16
- npm or yarn
- AWS S3 account (for photo uploads)
- SMTP email service

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   cd "DOG ATLAS"
   npm install
   ```

2. **Database Setup**
   ```bash
   # Install PostgreSQL (macOS with Homebrew)
   brew install postgresql@16
   brew services start postgresql@16
   
   # Run automated setup
   chmod +x scripts/setup_db.sh
   ./scripts/setup_db.sh
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Schema**
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Create Admin User**
   ```bash
   npx tsx scripts/create_admin.ts
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://dogatlas:dogatlas@localhost:5432/dogatlas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@dogatlas.app"

# AWS S3 (Photo uploads)
AWS_REGION="eu-central-1"
AWS_S3_BUCKET="dogatlas-photos"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
# Optional if using R2/MinIO:
# S3_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"
```

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL with Prisma ORM. Key configurations:
- Connection pooling enabled
- UUID primary keys
- JSON fields for flexible data storage
- Geospatial data types for coordinates
- Indexing on frequently queried fields

### Authentication Configuration
NextAuth.js setup with:
- Email magic link provider
- Database sessions
- Custom user roles (USER, MOD, ADMIN)
- Session callbacks for role attachment

### AWS S3 Configuration
Photo upload system using:
- Presigned URLs for secure client-side uploads
- Organized folder structure: `places/{placeId}/photos/`
- Image optimization and resizing (if implemented)
- CDN distribution for fast loading

## 📊 API Documentation

### Places API (`/api/places`)

**GET** - Retrieve places with filtering
```typescript
Query Parameters:
- city?: string (default: "Berlin")
- features?: string (comma-separated feature IDs)
- search?: string (text search)
- lat?: number (user latitude for distance)
- lng?: number (user longitude for distance)
- radius?: number (search radius in km)
- page?: number (pagination)
- limit?: number (results per page)

Response:
{
  places: Place[],
  total: number,
  page: number,
  totalPages: number
}
```

**POST** - Create new place (authenticated)
```typescript
Body: {
  name: string,
  description?: string,
  latitude: number,
  longitude: number,
  city: string,
  features: string[]
}
```

### Reviews API (`/api/reviews`)

**POST** - Submit review (authenticated)
```typescript
Body: {
  placeId: string,
  rating: number (1-5),
  body?: string,
  tags?: string[]
}
```

### Photos API (`/api/photos`)

**POST** - Upload photo (authenticated)
```typescript
Body: FormData with 'file' field
Response: { url: string }
```

**GET** - Get presigned upload URL
```typescript
Query: { filename: string, contentType: string }
Response: { url: string, fields: object }
```

### Submissions API (`/api/submissions`)

**GET** - List submissions (MOD/ADMIN only)
**POST** - Submit content for moderation
**PATCH** - Approve/reject submissions (MOD/ADMIN only)

## 🎨 UI/UX Design

### Design System
- **Colors**: Blue primary (#3B82F6), semantic colors for status
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Card-based layouts, button variants, form controls

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Minimum 44px touch targets
- **Navigation**: Collapsible mobile navigation

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant colors

## 🔒 Security

### Authentication Security
- Magic link authentication prevents password attacks
- Session tokens with expiration
- CSRF protection via NextAuth
- Secure cookie settings

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- File upload restrictions and validation
- Rate limiting on API endpoints

### Role-based Authorization
```typescript
// User Roles and Permissions
USER: {
  - Submit reviews and photos
  - View public content
  - Edit own submissions
}

MOD: {
  - All USER permissions
  - Moderate submissions
  - Approve/reject content
  - Access moderation dashboard
}

ADMIN: {
  - All MOD permissions
  - Manage users
  - System configuration
  - Full database access
}
```

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user journey testing
- **Manual Testing**: Cross-browser and device testing

### Test Commands
```bash
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:coverage  # Generate coverage report
npm run lint           # Run ESLint
npm run typecheck      # TypeScript type checking
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set production environment variables
- Configure database with connection pooling
- Set up CDN for static assets
- Configure email service
- Set up monitoring and logging

### Deployment Platforms
- **Vercel**: Optimized for Next.js applications
- **Railway**: Full-stack deployment with PostgreSQL
- **AWS**: EC2 with RDS and S3
- **Docker**: Containerized deployment

## 🔍 Monitoring and Analytics

### Application Monitoring
- Error tracking and reporting
- Performance monitoring
- Database query analysis
- User activity tracking

### Key Metrics
- **Performance**: Page load times, API response times
- **Usage**: Active users, place submissions, reviews
- **Errors**: Error rates, failed uploads, authentication issues
- **Business**: User engagement, content quality, moderation queue

## 🔄 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git commit -m "feat: add feature description"
git push origin feature/feature-name

# Code review and merge
# Create pull request
# Review and merge to main
```

### Code Quality
- **Prettier**: Code formatting
- **ESLint**: Code linting and best practices
- **TypeScript**: Type safety and IDE support
- **Husky**: Pre-commit hooks for quality checks

### Database Management
```bash
# Schema changes
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma client
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create migration
```

## 📈 Future Roadmap

### Planned Features
- **Multi-city Support**: Expand beyond Berlin
- **Advanced Search**: Filters by amenities, size, reviews
- **Social Features**: User profiles, following, activity feeds
- **Mobile App**: React Native companion app
- **API Integration**: Third-party data sources
- **AI Features**: Smart recommendations, content moderation

### Technical Improvements
- **Performance**: Image optimization, caching strategies
- **Scalability**: Database sharding, microservices
- **Testing**: Comprehensive test coverage
- **Documentation**: API documentation, user guides
- **Monitoring**: Advanced analytics and alerting

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check PostgreSQL status
brew services list | grep postgresql
# Restart PostgreSQL
brew services restart postgresql@16
# Check connection
psql "postgresql://dogatlas:dogatlas@localhost:5432/dogatlas"
```

**NextAuth Session Issues**
```bash
# Clear browser cookies
# Check NEXTAUTH_SECRET is set
# Verify email configuration
```

**Map Loading Issues**
```bash
# Check MapLibre GL CSS import
# Verify network connectivity
# Check browser console for errors
```

### Debug Commands
```bash
# Database verification
./scripts/verify.sh

# Check server logs
npm run dev (check terminal output)

# Prisma debugging
npx prisma studio

# Network debugging
curl http://localhost:3000/api/places
```

## 📞 Support

### Getting Help
- **Documentation**: This project.md file
- **Code Comments**: Inline documentation in source code
- **Error Messages**: Descriptive error handling throughout app
- **Development Tools**: Browser DevTools, Prisma Studio

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request
5. Follow code review process

---

## 📊 Project Statistics

- **Total Files**: ~50 TypeScript/JavaScript files
- **Lines of Code**: ~5,000+ lines
- **Components**: 10+ React components
- **API Endpoints**: 15+ RESTful endpoints
- **Database Tables**: 6 main entities
- **Dependencies**: 25+ npm packages

## 🏆 Project Status

**Current Version**: 1.0.0 Beta
**Status**: Fully Functional Development Build
**Last Updated**: August 16, 2025
**Maintainer**: DogAtlas Development Team

---

*This documentation is maintained alongside the codebase and should be updated with any significant changes to the application architecture or features.*
