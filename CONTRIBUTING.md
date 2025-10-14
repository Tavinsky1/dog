# Contributing to DogAtlas

Thank you for your interest in contributing to DogAtlas! This guide will help you get started with development, understand our workflows, and submit high-quality contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Database Management](#database-management)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Deployment](#deployment)

## Code of Conduct

- **Be respectful**: Treat all contributors with respect
- **Be constructive**: Provide helpful feedback
- **Be patient**: Remember everyone is learning
- **Be inclusive**: Welcome contributors of all skill levels

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- PostgreSQL (for production testing)
- Vercel CLI (for deployments)

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dog.git
   cd dog
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local database URL
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Verify Setup**
   - Visit `http://localhost:3000`
   - Check that homepage loads
   - Verify no console errors

## Development Workflow

### 🚨 Golden Rule: Never Commit Directly to `main`

The `main` branch is protected and represents production. **All changes must go through pull requests.**

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feat/` - New features: `feat/global-navigation`
- `fix/` - Bug fixes: `fix/search-typeahead`
- `docs/` - Documentation: `docs/deployment-guide`
- `db/` - Database changes: `db/add-country-field`
- `refactor/` - Code refactoring: `refactor/routing-utils`
- `test/` - Test additions: `test/smoke-tests`
- `perf/` - Performance improvements: `perf/lazy-load-map`

### Step-by-Step Workflow

1. **Start from Latest `main`**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feat/my-feature
   ```

3. **Make Changes**
   - Write code
   - Test locally
   - Commit frequently with clear messages

4. **Commit with Conventional Commits**
   ```bash
   git add .
   git commit -m "feat: add global navigation system"
   ```

   Commit message format:
   ```
   <type>: <description>

   [optional body]

   [optional footer]
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

5. **Push Branch**
   ```bash
   git push origin feat/my-feature
   ```

6. **Create Pull Request**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Fill in PR template
   - Add preview URL from Vercel
   - Request review

7. **Address Review Feedback**
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review feedback"
   git push origin feat/my-feature
   ```

8. **Merge After Approval**
   - Ensure all checks pass
   - Squash merge (preferred) or merge commit
   - Delete feature branch after merge

## Coding Standards

### TypeScript

- **Strict mode enabled**: No `any` types without justification
- **Explicit return types**: For functions
- **Interfaces over types**: Prefer `interface` for objects
- **Meaningful names**: `getUserById` not `getUser`

```typescript
// ✅ Good
interface Country {
  iso: string;
  name: string;
  slug: string;
}

function getCountryBySlug(slug: string): Country | undefined {
  // ...
}

// ❌ Bad
type Country = any;
function get(s: string) {
  // ...
}
```

### React Components

- **Functional components**: Use hooks, not classes
- **Named exports**: Prefer named exports over default
- **Props interfaces**: Define interfaces for all props
- **Composition**: Small, reusable components

```typescript
// ✅ Good
interface CountryCardProps {
  country: Country;
  onClick?: () => void;
}

export function CountryCard({ country, onClick }: CountryCardProps) {
  return <div onClick={onClick}>{country.name}</div>;
}

// ❌ Bad
export default function Card(props: any) {
  return <div>{props.data.name}</div>;
}
```

### File Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
├── data/            # Static data (JSON files)
└── styles/          # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`CountryCard.tsx`)
- **Utilities**: camelCase (`routing.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RESULTS`)
- **Types**: PascalCase (`CountryData`)

### ESLint and Prettier

- **Run before committing**: `npm run lint`
- **Auto-fix**: `npm run lint -- --fix`
- **Prettier format**: `npm run format`

## Database Management

⚠️ **Critical**: DogAtlas uses a two-database architecture. See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) for full details.

### Golden Rules

1. **Production PostgreSQL is source of truth**
2. **Local changes MUST be synced to production**
3. **Never run destructive operations without backups**
4. **Test locally first, then sync to production**

### Making Database Changes

1. **Update Schema**
   ```bash
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name describe_change
   ```

2. **Test Locally**
   ```bash
   npm run dev
   # Verify changes work
   ```

3. **Sync to Production**
   ```bash
   # After testing locally
   PROD_DATABASE_URL="..." npx tsx scripts/sync_images_raw.ts
   ```

4. **Verify Production**
   ```bash
   PROD_DATABASE_URL="..." npx tsx scripts/check_prod_db.ts
   ```

### Database Scripts

All database scripts MUST include header documentation:

```typescript
/**
 * Script Name
 * 
 * TARGET DATABASE: [Local SQLite | Production PostgreSQL | Both]
 * SYNC REQUIRED: [Yes | No]
 * 
 * PURPOSE: What this script does
 * 
 * USAGE:
 *   For local: npx tsx scripts/my-script.ts
 *   For production: PROD_DATABASE_URL="..." npx tsx scripts/my-script.ts
 */
```

## Testing Requirements

### Manual Testing Checklist

Before submitting PR:

- [ ] Functionality works as expected
- [ ] No console errors
- [ ] Mobile responsive (test on device or DevTools)
- [ ] Desktop layout correct
- [ ] Images load correctly
- [ ] Links navigate properly
- [ ] Forms submit successfully
- [ ] Lighthouse score > 90

### Automated Tests

Run tests before pushing:

```bash
npm run test          # Run all tests
npm run test:unit     # Unit tests
npm run test:smoke    # Playwright smoke tests
```

### Writing Tests

Add tests for new features:

```typescript
// tests/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test('feature works correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Expected Text');
});
```

## Pull Request Process

### Before Opening PR

- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] Lint passes: `npm run lint`
- [ ] Database changes documented
- [ ] README updated (if needed)
- [ ] Preview deployment tested
- [ ] No merge conflicts with `main`

### PR Template

When opening PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Preview deployment tested
- [ ] Database changes tested
- [ ] Mobile responsive

## Preview URL
https://dog-atlas-abc123.vercel.app

## Screenshots (if applicable)
[Add screenshots]

## Database Changes
- [ ] Schema updated
- [ ] Migration created
- [ ] Production sync documented

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automatic checks**: CI/CD must pass
2. **Vercel preview**: Auto-generated for each PR
3. **Code review**: At least one approval required
4. **Testing**: Reviewer tests preview deployment
5. **Approval**: Reviewer approves PR
6. **Merge**: Squash and merge to `main`

### After Merge

- [ ] Verify production deployment succeeded
- [ ] Monitor for errors (first 15 minutes)
- [ ] Update related documentation
- [ ] Close related issues
- [ ] Delete feature branch

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Quick Reference

```bash
# Push creates preview deployment
git push origin feat/my-feature

# Merge to main deploys to production
# (via GitHub UI or CLI)

# Rollback if needed
npm run vercel:rollback
```

### Feature Flags

Use feature flags for gradual rollouts:

```typescript
// lib/featureFlags.ts
export const FEATURE_FLAGS = {
  ENABLE_MAP_VIEW: process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === 'true',
};

// In component
import { FEATURE_FLAGS } from '@/lib/featureFlags';

{FEATURE_FLAGS.ENABLE_MAP_VIEW && <MapView />}
```

Set flags in Vercel dashboard:
```
NEXT_PUBLIC_ENABLE_MAP_VIEW=true
```

## Common Tasks

### Adding a New Country

1. Update `data/countries.json`
2. Add country data with cities
3. Commit and push
4. Vercel auto-deploys
5. Verify on production

### Adding a New Place

1. Use admin UI (if available)
2. Or add to database directly
3. Run image scraper if needed
4. Sync to production database
5. Verify place appears

### Fixing a Bug

1. Create `fix/` branch
2. Write failing test (reproduces bug)
3. Fix the bug
4. Verify test passes
5. Submit PR

### Improving Performance

1. Identify bottleneck (Lighthouse, profiler)
2. Create `perf/` branch
3. Implement optimization
4. Measure improvement
5. Document results in PR

## Getting Help

- **Documentation**: Check `/docs` folder
- **Database**: See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Search GitHub Issues
- **Questions**: Open Discussion on GitHub

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README (for major contributions)

Thank you for contributing to DogAtlas! 🐕✨
