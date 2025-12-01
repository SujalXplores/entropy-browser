import { memo } from "react";

export const Header = memo(function Header() {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2">
      <h1 className="animate-flicker text-accent font-mono text-xl tracking-[0.3em] uppercase drop-shadow-[0_0_20px_var(--color-accent-glow)]">
        The Entropy Browser
      </h1>
      <p className="text-muted-dark mt-2 text-center font-mono text-xs tracking-wider">
        memories cannot be kept
      </p>
    </div>
  );
});
