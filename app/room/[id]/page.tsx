"use client";
import dynamic from "next/dynamic";
import Chat from "@/components/room/chat";
const Player = dynamic(() => import("@/components/room/player"), {
  ssr: false,
});
import Playlist from "@/components/room/playlist";
import { supabase } from "@/lib/supabase";
import { use, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListMusic, MessageSquare, User } from "lucide-react";
import Profile from "@/components/room/profile";
import { YouTubeVideo } from "@/app/actions/search-video";
import { getQueue, getTimestamp, setTimestamp } from "@/app/actions/videoqueue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface MessageAuthor {
  name: string;
  color: string;
  icon: string;
}

export function sendSystemMessage(channel: RealtimeChannel, content: string) {
  const message = {
    author: {
      name: "System",
      icon: "User",
      color: "black",
    },
    content,
  };

  channel?.send({
    type: "broadcast",
    event: "chat",
    payload: message,
  });
}

export default function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const channel = supabase.channel(`room-${id}`);

  const [messages, setMessages] = useState<
    { content: string; author: MessageAuthor }[]
  >([
    {
      author: {
        name: "System",
        icon: "User",
        color: "black",
      },
      content: `This is a new project and may contain bugs. Please report any issues you find on GitHub.`,
    },
    {
      author: {
        name: "System",
        icon: "User",
        color: "black",
      },
      content:
        "Video playback is synchronized: if one person's video pauses due to a slow connection, it will pause for everyone.",
    },
  ]);

  const [queue, setQueue] = useState<YouTubeVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>();
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(0);

  const [author, setAuthor] = useState<MessageAuthor>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("author");
      if (saved) {
        return JSON.parse(saved) as MessageAuthor;
      }
    }

    return {
      name: "user",
      color: "black",
      icon: "User",
    };
  });

  useEffect(() => {
    channel
      .on("broadcast", { event: "chat" }, (payload) => {
        const message = payload.payload;
        setMessages((prev) => [...prev, message]);
      })
      .on("broadcast", { event: "add-video" }, (payload) => {
        const video = payload.payload;
        setQueue((prev) => [...prev, video]);
      })
      .on("broadcast", { event: "video-control" }, async (payload) => {
        const control = payload.payload;

        if (control.action == "play") {
          setIsVideoPlaying(true);
        }

        if (control.action == "pause") setIsVideoPlaying(false);
        if (control.action == "seek") {
          setVideoTime(control.time.time);
          setTimestamp(id, control.time.time);
        }

        if (control.action == "ended") {
          setQueue(await getQueue(id));
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function ef() {
      setQueue(await getQueue(id));
      setVideoTime(await getTimestamp(id));

      sendSystemMessage(channel, `${author.name} joined the room.`);

      console.log(await getTimestamp(id));
    }
    ef();
  }, [id]);

  useEffect(() => {
    function ef() {
      setActiveVideo(queue[0] || "");
    }
    ef();
  }, [queue]);

  useEffect(() => {
    function ef() {
      const playerApi = window.playerApi?.api;
      if (playerApi) {
        const timeDiff = Math.abs(playerApi?.getCurrentTime() - videoTime);

        if (timeDiff > 1) {
          playerApi.seekTo(videoTime);
        }
      }
    }
    ef();
  }, [videoTime]);

  return (
    <main className="flex h-screen">
      <JoinRoomModal />

      <div className="flex-10/12 h-screen">
        <Player
          channel={channel}
          activeVideo={activeVideo}
          isVideoPlaying={isVideoPlaying}
          author={author}
          room={id}
          setQueue={setQueue}
        />
      </div>

      <Tabs
        defaultValue="chat"
        className="flex-2/12 flex flex-col h-full overflow-hidden"
      >
        <div className="grow overflow-y-auto">
          <TabsContent value="chat" className="m-0 border-none h-full">
            <Chat
              messages={messages}
              channel={channel}
              setMessages={setMessages}
              author={author}
            />
          </TabsContent>

          <TabsContent value="playlist" className="m-0 border-none h-full">
            <Playlist
              setQueue={setQueue}
              channel={channel}
              queue={queue}
              id={id}
            />
          </TabsContent>

          <TabsContent value="profile" className="m-0 border-none h-full">
            <Profile author={author} setAuthor={setAuthor} />
          </TabsContent>
        </div>

        <TabsList className="grid grid-cols-3 w-full h-24 rounded-none border-t bg-background p-0 shrink-0">
          <TabsTrigger
            value="chat"
            className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-muted h-full"
          >
            <MessageSquare className="h-8 w-8" />
            <span className="text-[10px] font-medium">Chat</span>
          </TabsTrigger>

          <TabsTrigger
            value="playlist"
            className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-muted h-full"
          >
            <ListMusic className="h-8 w-8" />
            <span className="text-[10px] font-medium">Playlist</span>
          </TabsTrigger>

          <TabsTrigger
            value="profile"
            className="flex flex-col items-center justify-center gap-2 data-[state=active]:bg-muted h-full"
          >
            <User className="h-8 w-8" />
            <span className="text-[10px] font-medium">Profile</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </main>
  );
}

export function JoinRoomModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            Join the room to start watching videos with your friends!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Button
            onClick={() => setIsModalOpen(false)}
            size="lg"
            className="w-full"
          >
            Join & Enable Audio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
