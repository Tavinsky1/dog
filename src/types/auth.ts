import { Session } from 'next-auth'

export interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

export interface AuthenticatedSession extends Session {
  user: AuthenticatedUser
}

export function isAuthenticatedSession(session: Session | null): session is AuthenticatedSession {
  return !!(session?.user && 'id' in session.user && typeof session.user.id === 'string')
}