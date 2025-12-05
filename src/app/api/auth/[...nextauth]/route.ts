import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Force NEXTAUTH_URL to production domain on Vercel
if (process.env.VERCEL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'https://www.dog-atlas.com'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }