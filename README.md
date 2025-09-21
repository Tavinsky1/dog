# 🐕 DogAtlas

**Find Amazing Dog-Friendly Places Around the World**

DogAtlas is a modern web platform that helps dog owners discover the best dog-friendly locations in their city. From cozy cafés with outdoor seating to off-leash parks and swimming spots, DogAtlas makes it easy to find places where both you and your furry friend are welcome.

![DogAtlas Homepage](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)

## ✨ Features

### 🎯 Core Features
- **Interactive Maps**: MapLibre GL-powered maps showing dog-friendly locations
- **Category Discovery**: 9 specialized categories from cafés to veterinary services
- **Place Reviews**: User-generated reviews with star ratings and photos
- **Smart Search**: Filter places by features (off-leash, water access, parking, etc.)
- **City Pages**: Dedicated pages for different cities (Berlin implemented)
- **Real-time Data**: Live place counts and dynamic content updates

### 🎨 Modern UI/UX (Manus Design)
- **Orange/Amber Theme**: Warm, dog-friendly color palette
- **Glassmorphism Effects**: Modern backdrop blur and transparency
- **Responsive Design**: Mobile-first approach with smooth animations
- **Intuitive Navigation**: Clear breadcrumbs and back buttons
- **Location Dropdown**: Scalable city selection system

### 📱 Categories
**Homepage Featured Categories:**
1. 🍽️ **Paws & Patios** - Dog-friendly cafés, restaurants & bars
2. 🏞️ **Parks & Play** - Off-leash areas and recreational spaces  
3. 🏊 **Splash & Swim** - Lakes, beaches & swimming spots
4. 🥾 **Trails & Treks** - Hiking trails and scenic walking routes

**Additional City Categories:**
5. 🏪 **Pet Stores** - Pet supplies and boutique shops
6. 🏥 **Veterinary Services** - Clinics, hospitals and emergency care
7. ✂️ **Dog Groomers** - Professional grooming and spa services
8. 🏨 **Dog Hotels** - Boarding, daycare and accommodation
9. 🐕‍🦺 **Trainers & Walkers** - Professional training and walking services

## � Project Organization (Spec-Kit)

DogAtlas uses **Spec-Kit** for organized, spec-driven development. This ensures all features are thoroughly planned and documented before implementation.

### 📁 Project Structure
```
├── specs/           # Feature specifications and requirements
├── plans/           # Development plans and roadmaps
├── tasks/           # Task management and checklists
├── .specify/        # Spec-kit configuration and templates
└── CONSTITUTION.md  # Project principles and governance
```

### 🛠️ Spec-Kit Commands
```bash
# Check project status and requirements
npm run spec:check

# Create new feature specification
npm run spec:new

# View current tasks
npm run spec:tasks

# Check project status
npm run project:status
```

### 📖 Key Documents
- **[CONSTITUTION.md](CONSTITUTION.md)** - Project principles and non-negotiable rules
- **[specs/dogatlas-platform-spec.md](specs/dogatlas-platform-spec.md)** - Complete platform specification
- **[plans/phase-1-completion-plan.md](plans/phase-1-completion-plan.md)** - Current development roadmap
- **[tasks/development-tasks.md](tasks/development-tasks.md)** - Active development tasks

## �🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Maps**: MapLibre GL JS with react-map-gl
- **Authentication**: NextAuth.js v4
- **Fonts**: Inter (body) + Nunito (headings)

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.14.0
- **File Storage**: AWS S3
- **Email**: SMTP (configurable provider)

### Infrastructure
- **Deployment**: Vercel (recommended)
- **Environment**: Docker support included
- **Database**: PostgreSQL with spatial extensions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Tavinsky1/dogatlas.git
cd dogatlas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dogatlas"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
# Add other environment variables as needed
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx tsx scripts/seed.ts
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your DogAtlas instance!

## 📁 Project Structure

```
dogatlas/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── berlin/            # Berlin city page
│   │   ├── places/[id]/       # Individual place pages
│   │   ├── leaderboard/       # User leaderboard
│   │   ├── mod/               # Moderation interface
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── HeaderWrapper.tsx  # Modern header with locations dropdown
│   │   ├── LocationsDropdown.tsx # Scalable city selection
│   │   ├── Hero.tsx           # Manus-styled hero component
│   │   ├── CategoryCard.tsx   # Enhanced category cards
│   │   └── ...                # Other components
│   └── lib/                   # Utility libraries
├── prisma/                    # Database schema & migrations
├── scripts/                   # Utility scripts
├── types/                     # TypeScript type definitions
└── ...
```

## 🌍 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Docker
```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📖 API Documentation

### Places API
- `GET /api/places` - List all places
- `GET /api/places/[id]` - Get place details
- `POST /api/places` - Create new place
- `PUT /api/places/[id]` - Update place
- `DELETE /api/places/[id]` - Delete place

### Reviews API
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Submit review
- `PUT /api/reviews/[id]` - Update review

### Counts API
- `GET /api/places/counts` - Get place counts by category

## 🔧 Configuration

### Environment Variables
See `.env.example` for all available configuration options.

### Database Schema
The project uses Prisma ORM. Key models:
- `User` - User accounts and profiles
- `Place` - Dog-friendly locations
- `Review` - User reviews and ratings
- `Photo` - Place photos
- `PlaceFeature` - Place characteristics

## 📊 Recent Updates (August 2025)

### 🎨 Manus UI/UX Redesign
- Modern orange/amber color scheme
- Glassmorphism effects and backdrop blur
- Enhanced typography with Nunito + Inter fonts
- Improved component animations and hover states

### 📋 Enhanced Navigation
- Category cards now include clear descriptions
- Added back buttons for intuitive navigation
- Converted "Berlin" to scalable "Locations" dropdown
- Future-ready architecture for global expansion

### 🛠️ Technical Improvements
- Updated to Next.js 15.4.6
- Tailwind CSS v3 compatibility fixes
- Enhanced TypeScript compliance
- Improved component architecture

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Project Documentation](./project.md)
- **Contributing**: [Contribution Guidelines](./CONTRIBUTING.md)

---

**Made with ❤️ for dog lovers everywhere** 🐕

*DogAtlas - Because every adventure is better with your best friend!*
