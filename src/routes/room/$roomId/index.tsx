import { Aside } from '#/components/room/aside'
import { VideoPlayer } from '#/components/room/video-player'
import { getUserId } from '#/lib/session'
import { addUserToRoom, removeUserFromRoom } from '#/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { z } from 'zod'

const serverLoader = createServerFn()
  .inputValidator(z.object({ roomId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { roomId } = data
    const userId = await getUserId()
    const res = await addUserToRoom({ data: { userId, roomId } })

    return { userId, roomMembers: res }
  })

export const Route = createFileRoute('/room/$roomId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await serverLoader({ data: { roomId: params.roomId } })

    return {
      roomId: params.roomId,
      ...data,
    }
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const { userId, roomId, roomMembers } = loaderData

  useEffect(() => {
    function handleUnload() {
      removeUserFromRoom({ data: { userId, roomId } })
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [roomId])

  return (
    <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-6">
      <VideoPlayer />
      <Aside />
      {roomMembers?.map((m) => (
        <div>{m.name}</div>
      ))}
    </div>
  )
}
