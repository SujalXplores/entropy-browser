"use client";

import { memo, useState, useCallback, useRef, type FormEvent } from "react";
import { audioManager } from "../audio-manager";

interface MemoryInputProps {
  onSubmit: (text: string) => void;
}

export const MemoryInput = memo(function MemoryInput({ onSubmit }: MemoryInputProps) {
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const input = inputRef.current;
      if (input?.value.trim()) {
        onSubmit(input.value);
        input.value = "";
      }
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="pointer-events-auto w-full max-w-2xl px-8">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          onKeyDown={() => audioManager.playTypingSound()}
          placeholder="type a memory and press enter..."
          className={`text-input caret-input placeholder:text-muted w-full border-b bg-transparent px-2 py-4 font-mono text-lg drop-shadow-[0_0_10px_var(--color-input-glow)] transition-all duration-500 outline-none placeholder:italic ${isTyping ? "border-border-active" : "border-border"} `}
          autoFocus
        />
        <div
          className={`input-glow absolute bottom-0 left-0 h-px transition-all duration-700 ${isTyping ? "w-full" : "w-0"}`}
        />
      </div>
    </form>
  );
});
