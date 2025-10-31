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

    useEffect(() => {
      if (onStateUpdate) {
        onStateUpdate({
          ...gameState,
          balance: displayBalance,
        });
      }
    }, [gameState, onStateUpdate, displayBalance]);

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

    const cellWidth = width / columns;
    const cellHeight = height / rows;

    const drawBackground = useCallback(
      (g: GraphicsType) => {
        g.clear();
        g.beginFill(0x000000, 0.15);
        g.drawRoundedRect(-width / 2, -height / 2, width, height, 16);
        g.endFill();

        const neonBlue = 0x00bfff;
        const borderRadius = 16;

        const drawNeonBorder = (isTop: boolean) => {
          const halfWidth = width / 2;
          const halfHeight = height / 2;
          const edgeY = isTop ? -halfHeight : halfHeight;
          const leftCornerX = -halfWidth + borderRadius;
          const rightCornerX = halfWidth - borderRadius;

          const leftCornerCenterX = -halfWidth + borderRadius;
          const leftCornerCenterY =
            edgeY + (isTop ? borderRadius : -borderRadius);

          const rightCornerCenterX = halfWidth - borderRadius;
          const rightCornerCenterY =
            edgeY + (isTop ? borderRadius : -borderRadius);

          const pathLength =
            Math.PI * borderRadius +
            (rightCornerX - leftCornerX) +
            Math.PI * borderRadius;

          let currentPathProgress = 0;

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

            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);

            currentPathProgress += arcLength / arcSegments;
          }

          const horizontalLength = rightCornerX - leftCornerX;
          const horizontalSegments = 50;

          for (let j = 0; j < horizontalSegments; j++) {
            const t = j / horizontalSegments;
            const nextT = (j + 1) / horizontalSegments;
            const segStartX = leftCornerX + t * horizontalLength;
            const segEndX = leftCornerX + nextT * horizontalLength;

            const progress =
              (currentPathProgress / pathLength + borderAnimation) % 1;

            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(segStartX, edgeY);
            g.lineTo(segEndX, edgeY);

            currentPathProgress += horizontalLength / horizontalSegments;
          }

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

            const lightPos = progress;
            const lightWidth = 0.15;
            const distFromLight = Math.abs(
              ((currentPathProgress / pathLength) % 1) - lightPos
            );
            const normalizedDist = Math.min(distFromLight, 1 - distFromLight);

            let opacity;
            if (normalizedDist < lightWidth) {
              opacity = 1.0 - (normalizedDist / lightWidth) * 0.3;
            } else {
              opacity = 0.5;
            }

            g.lineStyle(2.5, neonBlue, Math.min(opacity, 1.0));
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);

            currentPathProgress += arcLength / arcSegments;
          }
        };

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
