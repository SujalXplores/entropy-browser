export const PHYSICS = {
  gravity: { x: 0, y: 0.8 },
  decayStart: 8000,
  decayDuration: 4000,
  repulsionRadius: 120,
  repulsionForce: 0.15,
  fontSize: 24,
  letterSpacing: 0.7,
  maxBodiesPerBatch: 50,
  batchDelay: 16,
  wallThickness: 60,
} as const;

export const CANVAS = {
  gridSize: 50,
  trailOpacity: 0.3,
  particleCount: 3,
} as const;

export const BODY_OPTIONS = {
  friction: 0.6,
  frictionAir: 0.02,
  restitution: 0.3,
  density: 0.002,
  chamfer: { radius: 3 },
} as const;

export const STATE_UPDATE_THROTTLE = 100;
