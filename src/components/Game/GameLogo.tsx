import { Container, Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import { Assets } from "pixi.js";

interface GameLogoProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export const GameLogo = ({ x, y, width, height }: GameLogoProps) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoPath = "/images/logo.png";

  useEffect(() => {
    const loadLogo = async () => {
      try {
        await Assets.load(logoPath);
        setLogoLoaded(true);
      } catch (error) {
        console.error("Failed to load logo:", error);
      }
    };
    loadLogo();
  }, [logoPath]);

  if (!logoLoaded) {
    return null;
  }

  const logoTexture = Assets.get(logoPath);

  if (!logoTexture) {
    return null;
  }

  return (
    <Container position={[x, y]}>
      <Sprite
        texture={logoTexture}
        anchor={[0, 0]}
        width={width}
        height={height}
      />
    </Container>
  );
};
