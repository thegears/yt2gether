import { YouTubeVideo } from "@/app/actions/search-video";
import { RealtimeChannel } from "@supabase/supabase-js";
import ReactPlayer from "react-player";

export default function Player({
  channel,
  activeVideo,
  isVideoPlaying,
}: {
  channel: RealtimeChannel;
  activeVideo: YouTubeVideo | undefined;
  isVideoPlaying: boolean;
}) {
  return (
    <div className="w-full h-screen ">
      <ReactPlayer
        src={activeVideo?.url}
        playing={isVideoPlaying}
        controls={true}
        width="100%"
        height="100%"
        onPlay={() => {
          channel.send({
            type: "broadcast",
            event: "video-control",
            payload: { action: "play" },
          });
        }}
        onPause={() => {
          channel.send({
            type: "broadcast",
            event: "video-control",
            payload: { action: "pause" },
          });
        }}
      />
    </div>
  );
}
