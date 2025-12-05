import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Force NEXTAUTH_URL to production domain on Vercel
// This ensures that even if Vercel sets it to *.vercel.app, we use the custom domain
if (process.env.VERCEL_ENV === 'production') {
  process.env.NEXTAUTH_URL = 'https://www.dog-atlas.com'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }