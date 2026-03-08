"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="w-full">
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle Theme
      </Button>
    </div>
  );
}
