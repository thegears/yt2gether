import { YouTubeVideo } from "@/app/actions/search-video";
import {
  getLastAction,
  getQueue,
  setLastAction,
  updateQueue,
} from "@/app/actions/videoqueue";
import { MessageAuthor, sendSystemMessage } from "@/app/room/[id]/page";
import { RealtimeChannel } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function useMemo({
  channel,
  activeVideo,
  isVideoPlaying,
  author,
  room,
  setQueue,
}: {
  channel: RealtimeChannel;
  activeVideo: YouTubeVideo | undefined;
  isVideoPlaying: boolean;
  author: MessageAuthor;
  room: string;
  setQueue: Dispatch<SetStateAction<YouTubeVideo[]>>;
}) {
  return (
    <div className="w-full h-screen ">
      <ReactPlayer
        src={activeVideo?.url}
        playing={isVideoPlaying}
        controls={true}
        ref={(p) => {
          (window as any).playerApi = p;
        }}
        width="100%"
        height="100%"
        onPlay={async (e) => {
          if ((await getLastAction(room)) != "play") {
            sendSystemMessage(channel, `${author.name} played the video.`);
            setLastAction(room, "play");
            channel.send({
              type: "broadcast",
              event: "video-control",
              payload: { action: "play", author },
            });
          }
        }}
        onPause={async () => {
          if ((await getLastAction(room)) != "pause") {
            sendSystemMessage(channel, `${author.name} paused the video.`);

            setLastAction(room, "pause");
            channel.send({
              type: "broadcast",
              event: "video-control",
              payload: { action: "pause", author },
            });
          }
        }}
        onSeeked={(time) => {
          channel.send({
            type: "broadcast",
            event: "video-control",
            payload: { action: "seek", time, author },
          });
        }}
        onEnded={async () => {
          if ((await getLastAction(room)) != "ended") {
            setLastAction(room, "ended");
            await updateQueue(room);
            setQueue(await getQueue(room));

            channel.send({
              type: "broadcast",
              event: "video-control",
              payload: { action: "ended" },
            });
          }
        }}
      />
    </div>
  );
}
