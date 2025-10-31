import { Container, Sprite } from "@pixi/react";
import { useEffect, useMemo, useState, memo } from "react";
import { Assets, Circle } from "pixi.js";

interface SettingsIconProps {
  x: number;
  y: number;
  size?: number;
  onClick: () => void;
}

export const SettingsIcon = memo(
  ({ x, y, size = 35, onClick }: SettingsIconProps) => {
    const [iconLoaded, setIconLoaded] = useState(false);

    const iconPath = "/images/symbols/header_info_icon.png";

    const hitArea = useMemo(() => new Circle(0, 0, size / 2), [size]);

    useEffect(() => {
      const loadIcon = async () => {
        try {
          await Assets.load(iconPath);
          setIconLoaded(true);
        } catch (error) {
          console.error("Failed to load settings icon:", error);
        }
      };
      loadIcon();
    }, [iconPath]);

    const iconTexture = iconLoaded ? Assets.get(iconPath) : null;

    if (!iconLoaded || !iconTexture) {
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
          texture={iconTexture}
          anchor={[0.5, 0.5]}
          width={size}
          height={size}
        />
      </Container>
    );
  }
);
