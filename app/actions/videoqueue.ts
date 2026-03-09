"use server";

import { YouTubeVideo } from "./search-video";

const globalQueue = new Map<string, YouTubeVideo[]>();
const roomsTimestamp = new Map<
  string,
  { last_timestamp: number; video_time: number }
>();
const roomsLastAction = new Map<string, string>();

export async function addVideo(room: string, video: YouTubeVideo) {
  if (!globalQueue.has(room)) {
    globalQueue.set(room, []);
  }
  globalQueue.get(room)?.push(video);
}

export async function getQueue(room: string) {
  return globalQueue.get(room) || [];
}

export async function updateQueue(room: string) {
  if (!globalQueue.has(room)) {
    globalQueue.set(room, []);
  }
  globalQueue.set(room,globalQueue.get(room)?.slice(1) || []);
}

export async function setTimestamp(room: string, time: number) {
  roomsTimestamp.set(room, { last_timestamp: Date.now(), video_time: time });
}

export async function getTimestamp(room: string) {
  const roomTime = roomsTimestamp.get(room);
  const video_time = roomTime
    ? roomTime.video_time + (Date.now() - roomTime.last_timestamp)
    : 0;
  return video_time;
}

export async function setLastAction(room: string, action: string) {
  roomsLastAction.set(room, action);
}

export async function getLastAction(room: string) {
  return roomsLastAction.get(room);
}
