"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";

interface LetterBody extends Matter.Body {
  letter: string;
  createdAt: number;
  opacity: number;
  fontSize: number;
  originalColor: string;
}

export default function EntropyBrowser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const bodiesRef = useRef<LetterBody[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const groundRef = useRef<Matter.Body | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [bodyCount, setBodyCount] = useState(0);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [totalLost, setTotalLost] = useState(0);

  // Initialize Matter.js engine
  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.8 },
    });
    engineRef.current = engine;

    const updateDimensions = () => {
      if (containerRef.current) {
        renderRef.current = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
        updateBoundaries();
      }
    };

    const updateBoundaries = () => {
      if (!engineRef.current) return;

      // Remove old boundaries
      if (groundRef.current) {
        Matter.Composite.remove(engineRef.current.world, groundRef.current);
      }
      wallsRef.current.forEach((wall) => {
        Matter.Composite.remove(engineRef.current!.world, wall);
      });

      const { width, height } = renderRef.current;
      const wallThickness = 60;

      // Create ground
      groundRef.current = Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width * 2,
        wallThickness,
        {
          isStatic: true,
          friction: 0.8,
          restitution: 0.2,
          label: "ground",
        },
      );

      // Create walls
      const leftWall = Matter.Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        {
          isStatic: true,
          friction: 0.3,
          label: "wall",
        },
      );

      const rightWall = Matter.Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        {
          isStatic: true,
          friction: 0.3,
          label: "wall",
        },
      );

      wallsRef.current = [leftWall, rightWall];

      Matter.Composite.add(engineRef.current.world, [
        groundRef.current,
        leftWall,
        rightWall,
      ]);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  // Mouse tracking for repulsion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physics and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !engineRef.current) return;

    const DECAY_START = 8000; // Start fading after 8 seconds
    const DECAY_DURATION = 4000; // Fade over 4 seconds
    const REPULSION_RADIUS = 120;
    const REPULSION_FORCE = 0.15;

    const loop = () => {
      const engine = engineRef.current;
      if (!engine) return;

      const now = Date.now();
      const { width, height } = renderRef.current;

      // Update physics
      Matter.Engine.update(engine, 1000 / 60);

      // Apply mouse repulsion
      const mouse = mouseRef.current;
      bodiesRef.current.forEach((body) => {
        const dx = body.position.x - mouse.x;
        const dy = body.position.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < REPULSION_RADIUS && distance > 0) {
          const force =
            ((REPULSION_RADIUS - distance) / REPULSION_RADIUS) *
            REPULSION_FORCE;
          const angle = Math.atan2(dy, dx);

          Matter.Body.applyForce(body, body.position, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
          });

          // Add some spin for dramatic effect
          Matter.Body.setAngularVelocity(
            body,
            body.angularVelocity + (Math.random() - 0.5) * 0.1,
          );
        }
      });

      // Update opacity and remove dead bodies
      const bodiesToRemove: LetterBody[] = [];
      bodiesRef.current.forEach((body) => {
        const age = now - body.createdAt;
        if (age > DECAY_START) {
          const decayProgress = (age - DECAY_START) / DECAY_DURATION;
          body.opacity = Math.max(0, 1 - decayProgress);

          if (body.opacity <= 0) {
            bodiesToRemove.push(body);
          }
        }
      });

      // Remove dead bodies
      bodiesToRemove.forEach((body) => {
        Matter.Composite.remove(engine.world, body);
        bodiesRef.current = bodiesRef.current.filter((b) => b !== body);
        setTotalLost((prev) => prev + 1);
      });

      // Update body count for UI
      setBodyCount(bodiesRef.current.length);

      // Clear canvas with slight trail effect for ghostly feel
      ctx.fillStyle = "rgba(5, 5, 5, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid pattern for depth
      ctx.strokeStyle = "rgba(30, 30, 30, 0.3)";
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw mouse repulsion field
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        REPULSION_RADIUS,
      );
      gradient.addColorStop(0, "rgba(100, 100, 120, 0.1)");
      gradient.addColorStop(1, "rgba(100, 100, 120, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, REPULSION_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Draw letter bodies
      bodiesRef.current.forEach((body) => {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        const glowIntensity = body.opacity * 15;

        // Glow effect
        ctx.shadowColor = `rgba(180, 180, 200, ${body.opacity * 0.8})`;
        ctx.shadowBlur = glowIntensity;

        // Draw letter
        ctx.font = `${body.fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Multiple layers for glow
        ctx.fillStyle = `rgba(60, 60, 80, ${body.opacity * 0.3})`;
        ctx.fillText(body.letter, 2, 2);

        ctx.fillStyle = `rgba(200, 200, 220, ${body.opacity})`;
        ctx.fillText(body.letter, 0, 0);

        ctx.restore();
      });

      // Draw atmospheric particles
      for (let i = 0; i < 3; i++) {
        const px = Math.random() * width;
        const py = Math.random() * height;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(100, 100, 120, ${Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Create physics bodies from text
  const createTextBodies = useCallback((text: string) => {
    if (!engineRef.current || !text.trim()) return;

    const { width, height } = renderRef.current;
    const fontSize = 24;
    const letterSpacing = fontSize * 0.7;
    const totalWidth = text.length * letterSpacing;
    const startX = width / 2 - totalWidth / 2;

    const letters = text.split("");
    const now = Date.now();

    letters.forEach((letter, index) => {
      if (letter === " ") return; // Skip spaces but keep positioning

      // Stagger the spawn slightly for cascade effect
      setTimeout(() => {
        if (!engineRef.current) return;

        const x = startX + index * letterSpacing + (Math.random() - 0.5) * 10;
        const y = height * 0.35 + (Math.random() - 0.5) * 20;

        const body = Matter.Bodies.rectangle(
          x,
          y,
          fontSize * 0.6,
          fontSize * 0.8,
          {
            friction: 0.6,
            frictionAir: 0.02,
            restitution: 0.3,
            density: 0.002,
            angle: (Math.random() - 0.5) * 0.3,
            chamfer: { radius: 3 },
          },
        ) as LetterBody;

        body.letter = letter;
        body.createdAt = now + index * 50;
        body.opacity = 1;
        body.fontSize = fontSize;
        body.originalColor = "rgba(200, 200, 220, 1)";

        // Initial random velocity for organic feel
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * 2 - 1,
        });

        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

        Matter.Composite.add(engineRef.current!.world, body);
        bodiesRef.current.push(body);
      }, index * 30);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      createTextBodies(inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);
  };

  const handleInputBlur = () => {
    setIsTyping(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      {/* Physics Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Title */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <h1
            className="text-xl font-mono tracking-[0.3em] uppercase animate-flicker"
            style={{
              color: "rgba(100, 100, 120, 0.6)",
              textShadow: "0 0 20px rgba(100, 100, 120, 0.3)",
            }}
          >
            The Entropy Browser
          </h1>
          <p
            className="text-center text-xs font-mono mt-2 tracking-wider"
            style={{ color: "rgba(80, 80, 100, 0.5)" }}
          >
            memories cannot be kept
          </p>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="pointer-events-auto w-full max-w-2xl px-8"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="type a memory and press enter..."
              className="w-full bg-transparent border-b font-mono text-lg py-4 px-2 outline-none transition-all duration-500 placeholder:text-[rgba(100,100,120,0.4)] placeholder:italic"
              style={{
                color: "rgba(200, 200, 220, 0.9)",
                borderColor: isTyping
                  ? "rgba(150, 150, 170, 0.5)"
                  : "rgba(80, 80, 100, 0.3)",
                textShadow: "0 0 10px rgba(200, 200, 220, 0.3)",
                caretColor: "rgba(200, 200, 220, 0.8)",
              }}
              autoFocus
            />
            <div
              className="absolute bottom-0 left-0 h-px transition-all duration-700"
              style={{
                width: isTyping ? "100%" : "0%",
                background:
                  "linear-gradient(90deg, transparent, rgba(150, 150, 170, 0.5), transparent)",
              }}
            />
          </div>
        </form>

        {/* Instruction */}
        <p
          className="absolute bottom-24 text-xs font-mono tracking-wider animate-pulse"
          style={{ color: "rgba(80, 80, 100, 0.4)" }}
        >
          move your cursor through the debris
        </p>

        {/* Lost counter */}
        {totalLost > 0 && (
          <div
            className="absolute bottom-8 right-8 font-mono text-xs"
            style={{ color: "rgba(80, 80, 100, 0.4)" }}
          >
            <span className="block text-right">{totalLost} letters</span>
            <span className="block text-right">lost to entropy</span>
          </div>
        )}

        {/* Body count */}
        <div
          className="absolute bottom-8 left-8 font-mono text-xs"
          style={{ color: "rgba(80, 80, 100, 0.4)" }}
        >
          <span className="block">{bodyCount} fragments</span>
          <span className="block">still falling</span>
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Scan lines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
    </div>
  );
}
