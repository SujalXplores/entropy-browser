"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  usePhysicsEngine,
  useCanvasRenderer,
  Header,
  MemoryInput,
  StatsDisplay,
  Instruction,
  VignetteOverlay,
  ScanLinesOverlay,
  MuteToggle,
} from "./components/entropy";
import { audioManager } from "./components/entropy/audio-manager";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [physicsState, setPhysicsState] = useState({ bodyCount: 0, totalLost: 0 });

  const {
    setDimensions,
    setMousePosition,
    createTextBodies,
    update,
    getBodies,
    getMouse,
    getDimensions,
  } = usePhysicsEngine({ onStateChange: setPhysicsState });

  const { canvasRef, startLoop, stopLoop } = useCanvasRenderer({
    getBodies,
    getMouse,
    getDimensions,
    onUpdate: update,
  });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      setDimensions({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setDimensions, canvasRef]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setMousePosition]);

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, [startLoop, stopLoop]);

  useEffect(() => {
    const initAudio = () => {
      audioManager.initialize();
      window.removeEventListener("click", initAudio);
      window.removeEventListener("keydown", initAudio);
    };

    window.addEventListener("click", initAudio);
    window.addEventListener("keydown", initAudio);
    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("keydown", initAudio);
    };
  }, []);

  const handleMemorySubmit = useCallback(
    (text: string) => createTextBodies(text),
    [createTextBodies]
  );

  return (
    <div ref={containerRef} className="bg-background relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <Header />
        <MemoryInput onSubmit={handleMemorySubmit} />
        <Instruction />
        <StatsDisplay bodyCount={physicsState.bodyCount} totalLost={physicsState.totalLost} />
      </div>
      <VignetteOverlay />
      <ScanLinesOverlay />
      <MuteToggle />
    </div>
  );
}
