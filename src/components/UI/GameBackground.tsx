import { Container, Graphics, Sprite } from "@pixi/react";
import { Assets, Graphics as PixiGraphicsType, Texture } from "pixi.js";
import { useCallback, useEffect, useState } from "react";
import type { Size, Star, ExplosionParticle } from "../../types";

import { createGradientTexture } from "../../helper/textureUtils";
import { GAME_CONFIG } from "../../constants/game";

import { useExplosionAnimation } from "../../hooks/useExplosionAnimation";
import { useStarfieldAnimation } from "../../hooks/useStarfieldAnimation";
import { CometSprite } from "./CometSprite";
import { ExplosionEffect } from "./ExplosionEffect";

export const GameBackground = ({ width, height }: Size) => {
  const [bgTexture, setBgTexture] = useState<Texture>(Texture.EMPTY);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [cometTexture, setCometTexture] = useState<Texture | null>(null);

  const baseStars = useStarfieldAnimation({ width, height });
  const { explosionsRef, forceUpdate } = useExplosionAnimation();

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const texture = await Assets.load("/images/background.jpg");
        setBgTexture(texture);
        setBgLoaded(true);
      } catch (error) {
        console.error("Failed to load background image:", error);
        setBgTexture(createGradientTexture(width, height));
        setBgLoaded(true);
      }
    };

    const loadComet = async () => {
      try {
        const texture = await Assets.load("/images/symbols/comet.png");
        setCometTexture(texture);
      } catch (error) {
        console.error("Failed to load comet image:", error);
      }
    };

    loadBackground();
    loadComet();
  }, [width, height]);

  const [explodedCometIds, setExplodedCometIds] = useState<Set<number>>(
    () => new Set()
  );

  const drawStars = useCallback(
    (g: PixiGraphicsType | null) => {
      if (!g) return;
      g.clear();

      baseStars.forEach((star) => {
        if (star.type === "star" && !explodedCometIds.has(star.id || 0)) {
          g.beginFill(0xffffff, star.alpha);
          g.drawCircle(star.x, star.y, star.size);
          g.endFill();
        }
      });
    },
    [baseStars, explodedCometIds]
  );

  const handleCometClick = useCallback(
    (comet: Star): ExplosionParticle[] => {
      const particles: ExplosionParticle[] = [];

      for (let i = 0; i < GAME_CONFIG.EFFECTS.PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / GAME_CONFIG.EFFECTS.PARTICLE_COUNT;
        const speed = Math.random() * 3 + 2;
        particles.push({
          x: comet.x,
          y: comet.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          size: Math.random() * 6 + 4,
          color:
            GAME_CONFIG.EFFECTS.EXPLOSION_COLORS[
              Math.floor(
                Math.random() * GAME_CONFIG.EFFECTS.EXPLOSION_COLORS.length
              )
            ] || 0xff6600,
        });
      }

      explosionsRef.current.push(particles);
      setExplodedCometIds((prev) => {
        const next = new Set(prev);
        next.add(comet.id || 0);
        return next;
      });
      forceUpdate({});

      return particles;
    },
    [explosionsRef, forceUpdate]
  );

  if (!bgLoaded) {
    return null;
  }

  const cometObjects = baseStars.filter(
    (s) => s.type === "comet" && !explodedCometIds.has(s.id || 0)
  );

  return (
    <Container>
      <Sprite texture={bgTexture} width={width} height={height} />
      <Graphics draw={drawStars} />
      {cometTexture &&
        cometObjects.map((comet, index) => (
          <CometSprite
            key={`comet-${index}`}
            comet={comet}
            texture={cometTexture}
            onCometClick={handleCometClick}
          />
        ))}
      <ExplosionEffect explosions={explosionsRef.current} />
    </Container>
  );
};
