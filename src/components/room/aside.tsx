import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MessageCircle, PlayCircleIcon, UserIcon } from 'lucide-react'

export function Aside() {
  return (
    <aside className="md:col-span-1  border-2 border-cyan-300">
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <div className="flex-1">
          <TabsContent value="chat">
            <Chat />
          </TabsContent>
          <TabsContent value="playlist">
            <Playlist />
          </TabsContent>
          <TabsContent value="profile">
            <Profile />
          </TabsContent>
        </div>

        <TabsList className="w-full">
          <TabsTrigger value="chat">
            <MessageCircle />
            Chat
          </TabsTrigger>
          <TabsTrigger value="playlist">
            <PlayCircleIcon />
            Playlist
          </TabsTrigger>
          <TabsTrigger value="profile">
            <UserIcon />
            Profile
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </aside>
  )
}

function Chat() {
  return null
}

function Playlist() {
  return null
}

function Profile() {
  return null
}
