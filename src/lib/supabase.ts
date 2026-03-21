import { createClient } from '@supabase/supabase-js'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
)

export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const res = await supabaseClient
      .from('Profiles')
      .upsert([
        { id: data.userId, name: 'User', icon: 'User', color: '#000000' },
      ])
    return { success: res.error === null }
  })

export const createRoom = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ roomId: z.string().uuid() }))
  .handler(async ({ data }) => {
    await supabaseClient.from('Rooms').upsert({
      name: 'room',
      id: data.roomId,
    })
  })

export const addUserToRoom = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ userId: z.string().uuid(), roomId: z.string().uuid() }),
  )
  .handler(async ({ data }) => {
    const { userId, roomId } = data

    await supabaseClient
      .from('RoomMembers')
      .upsert([
        {
          room_id: roomId,
          user_id: userId,
        },
      ])
      .select(
        `
        Profile:user_id (
          id,
          name,
          icon,
          color
        )
      `,
      )
      .eq('room_id', roomId)

    const res = await supabaseClient
      .from('RoomMembers')
      .select(
        `
        ...user_id(
        id,
        name,
        icon,
        color)

      `,
      )
      .eq('room_id', roomId)

    return res.data
  })

export const removeUserFromRoom = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ userId: z.string().uuid(), roomId: z.string().uuid() }),
  )
  .handler(async ({ data }) => {
    const { userId, roomId } = data
    await supabaseClient
      .from('RoomMembers')
      .delete()
      .eq('user_id', userId)
      .eq('room_id', roomId)
  })
