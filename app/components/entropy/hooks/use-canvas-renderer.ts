"use client";

import { useRef, useCallback, useEffect } from "react";
import type { LetterBody, Dimensions, MousePosition } from "../types";
import { CANVAS, PHYSICS } from "../constants";

interface UseCanvasRendererProps {
  getBodies: () => LetterBody[];
  getMouse: () => MousePosition;
  getDimensions: () => Dimensions;
  onUpdate: () => void;
}

export function useCanvasRenderer({
  getBodies,
  getMouse,
  getDimensions,
  onUpdate,
}: UseCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const fontString = `${PHYSICS.fontSize}px "JetBrains Mono", "Fira Code", monospace`;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = getDimensions();
    const mouse = getMouse();
    const bodies = getBodies();
    const { gridSize, trailOpacity, particleCount } = CANVAS;
    const { repulsionRadius } = PHYSICS;

    ctx.fillStyle = `rgba(5, 5, 5, ${trailOpacity})`;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(30, 30, 30, 0.3)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const gradient = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      repulsionRadius
    );
    gradient.addColorStop(0, "rgba(100, 100, 120, 0.1)");
    gradient.addColorStop(1, "rgba(100, 100, 120, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, repulsionRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = fontString;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const { position, angle, letter, opacity } = body;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);

      ctx.shadowColor = `rgba(180, 180, 200, ${opacity * 0.8})`;
      ctx.shadowBlur = opacity * 15;

      const time = Date.now() * 0.001;
      const hue = (position.x * 0.1 + position.y * 0.1 + time * 20) % 360;
      
      ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${opacity * 0.3})`;
      ctx.fillText(letter, 2, 2);

      ctx.fillStyle = `hsla(${hue}, 80%, 85%, ${opacity})`;
      ctx.fillText(letter, 0, 0);

      ctx.restore();
    }

    for (let i = 0; i < particleCount; i++) {
      ctx.fillStyle = `rgba(100, 100, 120, ${Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [getBodies, getMouse, getDimensions, fontString]);

  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const loop = () => {
      if (!isRunningRef.current) return;
      onUpdate();
      render();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, [onUpdate, render]);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  return { canvasRef, startLoop, stopLoop };
}
