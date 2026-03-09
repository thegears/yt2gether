// global.d.ts
export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playerApi: any; // Buraya istersen daha spesifik bir tip de yazabilirsin
  }
}
