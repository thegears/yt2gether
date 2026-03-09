import { searchYoutubeVideos, YouTubeVideo } from "@/app/actions/search-video";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { addVideo } from "@/app/actions/videoqueue";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function Playlist({
  queue,
  setQueue,
  id,
  channel,
}: {
  queue: YouTubeVideo[];
  setQueue: Dispatch<SetStateAction<YouTubeVideo[]>>;
  id: string;
  channel: RealtimeChannel;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVideos, setSearchVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      const videos = await searchYoutubeVideos(searchTerm);

      setSearchVideos(videos);
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  return (
    <div className="h-full p-6 w-full ">
      <Popover
        open={searchVideos.length > 0}
        onOpenChange={() => {
          setSearchVideos([]);
        }}
      >
        <PopoverAnchor asChild>
          <Input
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => {
              setSearchVideos([]);
              setSearchTerm(e.target.value);
            }}
          />
        </PopoverAnchor>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 "
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ScrollArea className="h-196 overflow-auto">
            {searchVideos
              .filter((video) => video.thumbnail)
              .map((video, i) => (
                <SearchVideo
                  setSearchTerm={setSearchTerm}
                  setQueue={setQueue}
                  channel={channel}
                  key={i}
                  video={video}
                  room={id}
                />
              ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col gap-3">
        {queue
          .filter((video) => video.thumbnail)
          .map((video, i) => (
            <QueueVideo key={i} video={video} />
          ))}
      </div>
    </div>
  );
}

function SearchVideo({
  video,
  room,
  setSearchTerm,
  setQueue,
  channel,
}: {
  video: YouTubeVideo;
  room: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setQueue: Dispatch<SetStateAction<YouTubeVideo[]>>;
  channel: RealtimeChannel;
}) {
  function handleVideoClick() {
    setSearchTerm("");

    addVideo(room, video);
    setQueue((prev) => [...prev, video]);
    channel.send({
      type: "broadcast",
      event: "add-video",
      payload: video,
    });
  }

  return (
    <div
      onClick={handleVideoClick}
      className="flex flex-col 2xl:flex-row gap-4 p-2  border-b justify-center items-center hover:cursor-pointer hover:bg-slate-800"
    >
      <div className="relative w-32 shrink-0 aspect-video overflow-hidden rounded-lg">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs  break-all font-semibold text-center 2xl:text-start ">
          {video.title}
        </h3>
      </div>
    </div>
  );
}

function QueueVideo({ video }: { video: YouTubeVideo }) {
  return (
    <div className="flex flex-col 2xl:flex-row gap-4 p-2  border-b justify-center items-center">
      <div className="relative w-32 shrink-0 aspect-video overflow-hidden rounded-lg">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs  break-all font-semibold text-center 2xl:text-start ">
          {video.title}
        </h3>
      </div>
    </div>
  );
}
