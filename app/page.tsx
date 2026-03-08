"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const handleCreateRoom = () => {
    // ID sadece tıklandığı an üretilir
    const id = Math.random().toString(36).substring(2, 10);
    router.push(`/room/${id}`);
  };

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <Button onClick={handleCreateRoom}>sea</Button>
    </main>
  );
}
