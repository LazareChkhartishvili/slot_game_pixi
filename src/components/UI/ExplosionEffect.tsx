import { Container, Graphics } from "@pixi/react";
import type { ExplosionParticle } from "../../types";

interface ExplosionEffectProps {
  explosions: ExplosionParticle[][];
}

export const ExplosionEffect = ({ explosions }: ExplosionEffectProps) => {
  return (
    <>
      {explosions.map((explosion, expIndex) => (
        <Container key={`explosion-${expIndex}`}>
          {explosion.map((particle, partIndex) => (
            <Graphics
              key={`particle-${partIndex}`}
              draw={(g) => {
                g.clear();
                g.beginFill(particle.color, particle.life);
                g.drawCircle(
                  particle.x,
                  particle.y,
                  particle.size * particle.life
                );
                g.endFill();
              }}
            />
          ))}
        </Container>
      ))}
    </>
  );
};
