"use client";

import { useState, useEffect } from "react";
import { audioManager } from "../audio-manager";

export function MuteToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioManager.getMutedState());
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = audioManager.toggleMute();
    setIsMuted(newState);
  };

  return (
    <button
      onClick={toggle}
      className="border-border bg-background/50 text-foreground hover:bg-background hover:text-accent pointer-events-auto fixed right-8 bottom-8 z-50 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
