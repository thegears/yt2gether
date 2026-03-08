"use server";

import { YouTubeVideo } from "./search-video";

const globalQueue = new Map<string, YouTubeVideo[]>();

export async function addVideo(room: string, video: YouTubeVideo) {
  if (!globalQueue.has(room)) {
    globalQueue.set(room, []);
  }
  globalQueue.get(room)?.push(video);
}

export async function getQueue(room: string) {
  console.log(globalQueue);

  return globalQueue.get(room) || [];
}
