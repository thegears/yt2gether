"use client";
import Chat from "@/components/room/chat";
import Player from "@/components/room/player";
import Playlist from "@/components/room/playlist";
import { supabase } from "@/lib/supabase";
import { use, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListMusic, MessageSquare, User } from "lucide-react";
import Profile from "@/components/room/profile";
import { YouTubeVideo } from "@/app/actions/search-video";
import { getQueue } from "@/app/actions/videoqueue";
import ReactPlayer from "react-player";

export interface MessageAuthor {
  name: string;
  color: string;
  icon: string;
}

export default function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const channel = supabase.channel(`room-${id}`);

  const [messages, setMessages] = useState<
    { content: string; author: MessageAuthor }[]
  >([
    {
      content: "Selam beyler, oda kuruldu mu?",
      author: { name: "Ahmet", color: "#ef4444", icon: "Gamepad2" },
    },
    {
      content: "Aynen kurdum, linki gruba attım.",
      author: { name: "Semih", color: "#3b82f6", icon: "Terminal" },
    },
    {
      content: "Video kalitesi neden 480p? Kim başlattı bunu :D",
      author: { name: "Ceren", color: "#ec4899", icon: "Cat" },
    },
    {
      content: "Benim internet gg beyler kusura bakmayın.",
      author: { name: "Burak", color: "#10b981", icon: "Zap" },
    },
    {
      content: "Olsun kanka izliyoruz işte, sıkıntı yok.",
      author: { name: "Semih", color: "#3b82f6", icon: "Terminal" },
    },
    {
      content: "Şu videonun 2:30 dakikasındaki şarkı neydi?",
      author: { name: "Derya", color: "#f59e0b", icon: "Headphones" },
    },
    {
      content: "Shazamladım şimdi, Darude - Sandstorm'muş.",
      author: { name: "Ahmet", color: "#ef4444", icon: "Gamepad2" },
    },
    {
      content: "Klasik...",
      author: { name: "Ceren", color: "#ec4899", icon: "Cat" },
    },
    {
      content: "Beyler ses bende mi çok az yoksa genel mi?",
      author: { name: "Mert", color: "#8b5cf6", icon: "Cpu" },
    },
    {
      content: "Bende normal kanka, senin kulaklık ayarına bak bir.",
      author: { name: "Semih", color: "#3b82f6", icon: "Terminal" },
    },
    {
      content: "Ghost of Tsushima mı izlesek sonra?",
      author: { name: "Semih", color: "#3b82f6", icon: "Ghost" },
    },
  ]);

  const [queue, setQueue] = useState<YouTubeVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>();
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const playerRef = useRef<typeof ReactPlayer>(null);

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
      .on("broadcast", { event: "video-control" }, (payload) => {
        const control = payload.payload;

        if (control.action == "play") setIsVideoPlaying(true);
        if (control.action == "pause") setIsVideoPlaying(false);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function ef() {
      setQueue(await getQueue(id));
    }
    ef();
  }, [id]);

  useEffect(() => {
    function ef() {
      if (!activeVideo) setActiveVideo(queue[0]);
    }
    ef();
  }, [queue]);

  return (
    <main className="flex h-screen">
      <div className="flex-10/12 h-screen">
        <Player
          channel={channel}
          activeVideo={activeVideo}
          isVideoPlaying={isVideoPlaying}
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
