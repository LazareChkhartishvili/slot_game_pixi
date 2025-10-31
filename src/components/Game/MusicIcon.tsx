import { Container, Sprite } from "@pixi/react";
import { useEffect, useMemo, useState, memo } from "react";
import { Assets, Circle } from "pixi.js";

interface MusicIconProps {
  x: number;
  y: number;
  size?: number;
  isPlaying: boolean;
  onClick: () => void;
}

export const MusicIcon = memo(({
  x,
  y,
  size = 50,
  isPlaying,
  onClick,
}: MusicIconProps) => {
  const [soundOnLoaded, setSoundOnLoaded] = useState(false);
  const [soundOffLoaded, setSoundOffLoaded] = useState(false);

  const soundOnPath = "/images/symbols/sound_on.png";
  const soundOffPath = "/images/symbols/sound_off.png";

  // Memoize hitArea to prevent recreation
  const hitArea = useMemo(() => new Circle(0, 0, size / 2), [size]);

  // Load sound icons
  useEffect(() => {
    const loadIcons = async () => {
      try {
        await Assets.load(soundOnPath);
        setSoundOnLoaded(true);
        await Assets.load(soundOffPath);
        setSoundOffLoaded(true);
      } catch (error) {
        console.error("Failed to load sound icons:", error);
      }
    };
    loadIcons();
  }, [soundOnPath, soundOffPath]);

  const soundOnTexture = soundOnLoaded ? Assets.get(soundOnPath) : null;
  const soundOffTexture = soundOffLoaded ? Assets.get(soundOffPath) : null;
  const currentTexture = isPlaying ? soundOnTexture : soundOffTexture;

  if (!soundOnLoaded || !soundOffLoaded || !currentTexture) {
    return null;
  }

  return (
    <Container
      position={[x, y]}
      eventMode="static"
      cursor="pointer"
      pointertap={(e) => {
        e.stopPropagation();
        onClick();
      }}
      interactive={true}
      hitArea={hitArea}
    >
      <Sprite
        texture={currentTexture}
        anchor={[0.5, 0.5]}
        width={size}
        height={size}
      />
    </Container>
  );
});
