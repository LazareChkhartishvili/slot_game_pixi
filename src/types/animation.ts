import type { Position } from "./common";

export interface Star extends Position {
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  type?: "star" | "comet";
  id?: number;
}

export interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: number;
}
