import { useSession } from '@tanstack/react-start/server'
import { updateProfile } from './supabase'

type SessionData = {
  userId?: string
}

export async function getUserId() {
  const session = await useSession<SessionData>({
    name: 'app',
    password:
      'wdwqdqwdwqdwqdwqwdwqdqwdwqdwqdwqwdwqdqwdwqdwqdwqwdwqdqwdwqdwqdwq',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })

  var userId = session.data.userId

  if (!session.data.userId) {
    const randomUUID = crypto.randomUUID()
    userId = randomUUID

    await session.update({ userId: randomUUID })

    updateProfile({ data: { userId: randomUUID } })
  }

  return userId!
}
