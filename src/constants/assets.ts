/**
 * Asset paths configuration
 */

export const SYMBOL_ASSETS = [
  "images/symbols/a.png",
  "images/symbols/alien.png",
  "images/symbols/apollo.png",
  "images/symbols/cosmo-head.png",
  "images/symbols/j.png",
  "images/symbols/k.png",
  "images/symbols/loop.png",
  "images/symbols/o.png",
  "images/symbols/rock.png",
  "images/symbols/scatter.png",
  "images/symbols/ten.png",
  "images/symbols/wild.png",
] as const;

export const BG_ASSETS = SYMBOL_ASSETS.map((path) => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];

  if (!filename) {
    throw new Error(`Invalid asset path: ${path}`);
  }

  const nameWithoutExt = filename.split(".")[0];

  if (!nameWithoutExt) {
    throw new Error(`Invalid filename: ${filename}`);
  }

  // Create the background path
  return `images/symbol_bgs/${nameWithoutExt}_bg.png`;
}) as readonly string[];
