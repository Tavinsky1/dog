# DOGGYWORLD

DOGGYWORLD is a web application for finding dog-friendly places, including trails, parks, cafés, and more. This project is built with Next.js, using the App Router, Prisma, and NextAuth for a robust and scalable architecture.

## Getting Started

Follow these steps to set up and run the project locally.

### Create the Project Folder and Scaffolding

From your top-level workspace, run the following commands in your terminal to create the project folder and scaffold a new Next.js application.

```bash
mkdir DOGGYWORLD && cd DOGGYWORLD
npx create-next-app@latest . \
  --ts --app --tailwind --eslint --src-dir --import-alias "@/*"
```

### Install Dependencies

Install the core packages and development dependencies.

```bash
# Core dependencies
npm i @prisma/client prisma zod csv-parse uuid bcryptjs next-auth @auth/prisma-adapter leaflet react-leaflet

# Dev dependencies
npm i -D @types/bcryptjs @types/uuid
```

### Environment Variables

Create a `.env.local` file in the root of your project and add the following keys. These are essential for connecting to your database and using authentication services.

```
DATABASE_URL=postgres://user:pass@localhost:5432/doggyworld
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_string
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Database Setup

Use Prisma to set up your database schema and push it to your local Postgres instance.

1. Replace the contents of `./prisma/schema.prisma` with the provided schema.
2. Run the Prisma commands to generate the client and push the schema to your database.

```bash
npx prisma generate
npx prisma db push
```

### Running the App

After completing the setup, you can start the development server.

```bash
npm run dev
```

The application will be accessible at http://localhost:3000.