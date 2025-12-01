import { memo } from "react";

export const Instruction = memo(function Instruction() {
  return (
    <p className="text-muted absolute bottom-24 animate-pulse font-mono text-xs tracking-wider">
      move your cursor through the debris
    </p>
  );
});

export const VignetteOverlay = memo(function VignetteOverlay() {
  return <div className="vignette pointer-events-none absolute inset-0" />;
});

export const ScanLinesOverlay = memo(function ScanLinesOverlay() {
  return <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03]" />;
});
