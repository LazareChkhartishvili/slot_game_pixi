import { Container, Graphics } from "@pixi/react";
import {
  useCallback,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Graphics as GraphicsType } from "pixi.js";
import { GAME_CONFIG } from "../../constants/game";
import type {
  SlotMachineRef,
  SlotMachineProps,
  SlotMachineState,
} from "../../types";
import { SlotMachineService } from "../../controllers/slotMachineService";
import { ReelsContainer } from "./ReelsContainer";
import { useBalanceAnimation } from "../../hooks/useBalanceAnimation";
import { useBorderAnimation } from "../../hooks/useBorderAnimation";

/**
 * SlotMachineReels component - Main game machine rendering
 */
export const SlotMachineReels = forwardRef<SlotMachineRef, SlotMachineProps>(
  ({ x, y, width, height, onStateUpdate, fastMode = false }, ref) => {
    const columns = GAME_CONFIG.REELS.COLUMNS;
    const rows = GAME_CONFIG.REELS.ROWS;

    const serviceRef = useRef(new SlotMachineService(columns, rows));
    const [gameState, setGameState] = useState<SlotMachineState>(
      serviceRef.current.getState()
    );

    const displayBalance = useBalanceAnimation(gameState.balance);
    const borderAnimation = useBorderAnimation();

    // Notify parent of state changes
    useEffect(() => {
      if (onStateUpdate) {
        onStateUpdate({
          ...gameState,
          balance: displayBalance,
        });
      }
    }, [gameState, onStateUpdate, displayBalance]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      spin: async () => {
        if (gameState.isSpinning) {
          return Promise.reject(new Error("Already spinning"));
        }

        setGameState((prev) => ({ ...prev, isSpinning: true }));

        return serviceRef.current
          .spin()
          .then((result) => {
            const newState = serviceRef.current.getState();
            setGameState(newState);
            return result;
          })
          .catch((error) => {
            setGameState((prev) => ({ ...prev, isSpinning: false }));
            throw error;
          });
      },
      getState: () => gameState,
      setBet: (amount: number) => {
        try {
          serviceRef.current.setBet(amount);
          setGameState(serviceRef.current.getState());
        } catch (error) {
          console.error("Failed to set bet:", error);
        }
      },
      addBonus: (amount: number) => {
        serviceRef.current.addBonus(amount);
        setGameState(serviceRef.current.getState());
      },
    }));

    // Calculate dimensions for each cell in the grid
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    const drawBackground = useCallback(
      (g: GraphicsType) => {
        g.clear();
        g.beginFill(0x000000, 0.15);
        // Outer rectangle - exact size, no padding
        g.drawRoundedRect(-width / 2, -height / 2, width, height, 16);
        g.endFill();

        // Neon blue glowing border animation - only top and bottom edges
        const neonBlue = 0x00bfff; // Bright neon blue like in the image
        const borderRadius = 16;

        // Draw neon border on top and bottom edges only with rounded corners
        const drawNeonBorder = (isTop: boolean) => {
          const halfWidth = width / 2;
          const halfHeight = height / 2;
          const edgeY = isTop ? -halfHeight : halfHeight;
          const leftCornerX = -halfWidth + borderRadius;
          const rightCornerX = halfWidth - borderRadius;

          // Left corner arc center
          const leftCornerCenterX = -halfWidth + borderRadius;
          const leftCornerCenterY =
            edgeY + (isTop ? borderRadius : -borderRadius);

          // Right corner arc center
          const rightCornerCenterX = halfWidth - borderRadius;
          const rightCornerCenterY =
            edgeY + (isTop ? borderRadius : -borderRadius);

          // Calculate path length (left corner + horizontal + right corner)
          const pathLength =
            Math.PI * borderRadius +
            (rightCornerX - leftCornerX) +
            Math.PI * borderRadius;

          let currentPathProgress = 0;

          // Left corner arc
          const arcLength = (Math.PI / 2) * borderRadius;
          const leftStartAngle = isTop ? Math.PI : Math.PI / 2;
          const leftEndAngle = isTop ? Math.PI + Math.PI / 2 : Math.PI;
          const arcSegments = 15;

          for (let j = 0; j < arcSegments; j++) {
            const angle1 =
              leftStartAngle +
              (j / arcSegments) * (leftEndAngle - leftStartAngle);
            const angle2 =
              leftStartAngle +
              ((j + 1) / arcSegments) * (leftEndAngle - leftStartAngle);

            const x1 = leftCornerCenterX + borderRadius * Math.cos(angle1);
            const y1 = leftCornerCenterY + borderRadius * Math.sin(angle1);
            const x2 = leftCornerCenterX + borderRadius * Math.cos(angle2);
            const y2 = leftCornerCenterY + borderRadius * Math.sin(angle2);

            const progress =
              (currentPathProgress / pathLength + borderAnimation) % 1;

            // Smooth traveling light effect
            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              // Smooth gradient for traveling light
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              // Very subtle, smooth base glow - no pulse
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);

            currentPathProgress += arcLength / arcSegments;
          }

          // Horizontal edge
          const horizontalLength = rightCornerX - leftCornerX;
          const horizontalSegments = 50;

          for (let j = 0; j < horizontalSegments; j++) {
            const t = j / horizontalSegments;
            const nextT = (j + 1) / horizontalSegments;
            const segStartX = leftCornerX + t * horizontalLength;
            const segEndX = leftCornerX + nextT * horizontalLength;

            const progress =
              (currentPathProgress / pathLength + borderAnimation) % 1;

            // Smooth traveling light effect
            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              // Smooth gradient for traveling light
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              // Very subtle, smooth base glow - no pulse
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(segStartX, edgeY);
            g.lineTo(segEndX, edgeY);

            currentPathProgress += horizontalLength / horizontalSegments;
          }

          // Right corner arc
          const rightStartAngle = isTop ? -Math.PI / 2 : 0;
          const rightEndAngle = isTop ? 0 : Math.PI / 2;

          for (let j = 0; j < arcSegments; j++) {
            const angle1 =
              rightStartAngle +
              (j / arcSegments) * (rightEndAngle - rightStartAngle);
            const angle2 =
              rightStartAngle +
              ((j + 1) / arcSegments) * (rightEndAngle - rightStartAngle);

            const x1 = rightCornerCenterX + borderRadius * Math.cos(angle1);
            const y1 = rightCornerCenterY + borderRadius * Math.sin(angle1);
            const x2 = rightCornerCenterX + borderRadius * Math.cos(angle2);
            const y2 = rightCornerCenterY + borderRadius * Math.sin(angle2);

            const progress =
              (currentPathProgress / pathLength + borderAnimation) % 1;

            // Smooth traveling light effect
            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              // Smooth gradient for traveling light
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              // Very subtle, smooth base glow - no pulse
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);

            currentPathProgress += arcLength / arcSegments;
          }
        };

        // Draw neon border on top and bottom edges only
        drawNeonBorder(true);
        drawNeonBorder(false);
      },
      [width, height, borderAnimation]
    );

    return (
      <Container position={[x, y]}>
        <Graphics draw={drawBackground} />
        <ReelsContainer
          x={-width / 2}
          y={-height / 2}
          columns={columns}
          rows={rows}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          isSpinning={gameState.isSpinning}
          reelPositions={gameState.reelPositions}
          winningPositions={gameState.winningPositions || []}
          fastMode={fastMode}
        />
      </Container>
    );
  }
);

SlotMachineReels.displayName = "SlotMachineReels";
