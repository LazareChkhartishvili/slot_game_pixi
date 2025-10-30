import { Texture } from "pixi.js";

export const createGradientTexture = (
  width: number,
  height: number
): Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return Texture.EMPTY;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0b0c1c");
  gradient.addColorStop(0.5, "#1a1042");
  gradient.addColorStop(1, "#3a0f4a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return Texture.from(canvas);
};
