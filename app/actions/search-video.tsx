"use server";
import yts from "yt-search";
export interface YouTubeVideo {
  url: string;
  title: string;
  thumbnail: string;
  timestamp: string;
}

export async function searchYoutubeVideos(query: string) {
  if (!query || query.length < 3) return [];
  const videos = await yts(query);
  return videos.videos.map((v: YouTubeVideo) => ({
    title: v.title,
    thumbnail: v.thumbnail,
    timestamp: v.timestamp,
    url: v.url,
  }));
}
