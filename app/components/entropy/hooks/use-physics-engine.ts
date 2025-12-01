"use client";

import { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";
import type { LetterBody, Dimensions, MousePosition } from "../types";
import { PHYSICS, BODY_OPTIONS, STATE_UPDATE_THROTTLE } from "../constants";

interface PhysicsState {
  bodyCount: number;
  totalLost: number;
}

interface UsePhysicsEngineProps {
  onStateChange: (state: PhysicsState) => void;
}

export function usePhysicsEngine({ onStateChange }: UsePhysicsEngineProps) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const dimensionsRef = useRef<Dimensions>({ width: 0, height: 0 });
  const bodiesRef = useRef<LetterBody[]>([]);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const groundRef = useRef<Matter.Body | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);
  const stateRef = useRef<PhysicsState>({ bodyCount: 0, totalLost: 0 });
  const lastStateUpdateRef = useRef<number>(0);

  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: PHYSICS.gravity });
    engineRef.current = engine;

    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, []);

  const updateBoundaries = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (groundRef.current) {
      Matter.Composite.remove(engine.world, groundRef.current);
    }
    wallsRef.current.forEach((wall) => {
      Matter.Composite.remove(engine.world, wall);
    });

    const { width, height } = dimensionsRef.current;
    const { wallThickness } = PHYSICS;

    groundRef.current = Matter.Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width * 2,
      wallThickness,
      { isStatic: true, friction: 0.8, restitution: 0.2, label: "ground" }
    );

    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, friction: 0.3, label: "wall" }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, friction: 0.3, label: "wall" }
    );

    wallsRef.current = [leftWall, rightWall];
    Matter.Composite.add(engine.world, [groundRef.current, leftWall, rightWall]);
  }, []);

  const setDimensions = useCallback(
    (dimensions: Dimensions) => {
      dimensionsRef.current = dimensions;
      updateBoundaries();
    },
    [updateBoundaries]
  );

  const setMousePosition = useCallback((position: MousePosition) => {
    mouseRef.current = position;
  }, []);

  const createTextBodies = useCallback((text: string) => {
    const engine = engineRef.current;
    if (!engine || !text.trim()) return;

    const { width, height } = dimensionsRef.current;
    const { fontSize, letterSpacing, maxBodiesPerBatch, batchDelay } = PHYSICS;
    const spacing = fontSize * letterSpacing;
    const totalWidth = text.length * spacing;
    const startX = width / 2 - totalWidth / 2;
    const chars = text.split("");
    const now = Date.now();

    let letterIndex = 0;

    const processBatch = (startIdx: number) => {
      if (!engineRef.current) return;

      const bodiesToAdd: LetterBody[] = [];
      let processed = 0;

      for (let i = startIdx; i < chars.length && processed < maxBodiesPerBatch; i++) {
        if (chars[i] === " ") continue;

        const x = startX + i * spacing + (Math.random() - 0.5) * 10;
        const y = height * 0.35 + (Math.random() - 0.5) * 20;

        const body = Matter.Bodies.rectangle(x, y, fontSize * 0.6, fontSize * 0.8, {
          ...BODY_OPTIONS,
          angle: (Math.random() - 0.5) * 0.3,
        }) as LetterBody;

        body.letter = chars[i];
        body.createdAt = now + letterIndex * 50;
        body.opacity = 1;
        body.fontSize = fontSize;

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * 2 - 1,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

        bodiesToAdd.push(body);
        letterIndex++;
        processed++;
      }

      if (bodiesToAdd.length > 0) {
        Matter.Composite.add(engineRef.current!.world, bodiesToAdd);
        bodiesRef.current.push(...bodiesToAdd);
      }

      const nextIdx = startIdx + processed + (chars[startIdx + processed] === " " ? 1 : 0);
      if (nextIdx < chars.length) {
        setTimeout(() => processBatch(nextIdx), batchDelay);
      }
    };

    processBatch(0);
  }, []);

  const update = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const now = Date.now();
    const { decayStart, decayDuration, repulsionRadius, repulsionForce } = PHYSICS;

    Matter.Engine.update(engine, 1000 / 60);

    const mouse = mouseRef.current;
    const bodies = bodiesRef.current;
    const radiusSq = repulsionRadius * repulsionRadius;

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const dx = body.position.x - mouse.x;
      const dy = body.position.y - mouse.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < radiusSq && distSq > 0) {
        const distance = Math.sqrt(distSq);
        const force = ((repulsionRadius - distance) / repulsionRadius) * repulsionForce;
        const angle = Math.atan2(dy, dx);

        Matter.Body.applyForce(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force,
        });
        Matter.Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.1);
      }
    }

    const indicesToRemove: number[] = [];

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const age = now - body.createdAt;

      if (age > decayStart) {
        body.opacity = Math.max(0, 1 - (age - decayStart) / decayDuration);
        if (body.opacity <= 0) {
          indicesToRemove.push(i);
        }
      }
    }

    if (indicesToRemove.length > 0) {
      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        const body = bodies[indicesToRemove[i]];
        Matter.Composite.remove(engine.world, body);
        bodies.splice(indicesToRemove[i], 1);
      }
      stateRef.current.totalLost += indicesToRemove.length;
    }

    stateRef.current.bodyCount = bodies.length;

    if (now - lastStateUpdateRef.current > STATE_UPDATE_THROTTLE) {
      lastStateUpdateRef.current = now;
      onStateChange({ ...stateRef.current });
    }
  }, [onStateChange]);

  const getBodies = useCallback(() => bodiesRef.current, []);
  const getMouse = useCallback(() => mouseRef.current, []);
  const getDimensions = useCallback(() => dimensionsRef.current, []);

  return {
    setDimensions,
    setMousePosition,
    createTextBodies,
    update,
    getBodies,
    getMouse,
    getDimensions,
  };
}
