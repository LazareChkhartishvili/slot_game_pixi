import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Graphics as GraphicsType } from "pixi.js";
import { useCallback } from "react";
import { formatCurrency } from "../../helper/formatCurrency";
import { GAME_CONFIG } from "../../constants/game";
import type { BetControlsProps } from "../../types";

export const BetAmountControls = ({
  x,
  y,
  betAmount,
  onChangeBet,
  disabled,
}: BetControlsProps) => {
  const panelWidth = 330;
  const panelHeight = 90;
  const panelRadius = 18;

  /** --- Main background panel --- */
  const drawBackground = useCallback((g: GraphicsType) => {
    g.clear();

    const bgColor = "#241c47";
    const borderColor = 0x3344aa;

    g.beginFill(bgColor, 0.9);
    g.lineStyle(2, borderColor, 0.4);
    g.drawRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      panelRadius
    );
    g.endFill();
  }, []);

  /** --- Button look --- */
  const drawButton = useCallback(
    (g: GraphicsType) => {
      g.clear();
      const size = 48;
      const radius = 16;
      const bg = disabled ? 0x2b2d58 : "#242253";
      g.beginFill(bg, 0.9);
      g.drawRoundedRect(-size / 2, -size / 2, size, size, radius);
      g.endFill();
    },
    [disabled]
  );

  /** --- Logic --- */
  const getBetStep = useCallback((currentBet: number): number => {
    if (currentBet < 2.0) {
      return 0.2; // Step by $0.20 until $2.00
    } else if (currentBet < 10.0) {
      return 1.0; // Step by $1.00 until $10.00
    } else {
      return 5.0; // Step by $5.00 above $10.00
    }
  }, []);

  const handleIncreaseBet = useCallback(() => {
    if (!disabled && betAmount < GAME_CONFIG.INITIAL_STATE.MAX_BET) {
      const step = getBetStep(betAmount);
      const newBet = Math.min(
        Math.round((betAmount + step) * 100) / 100,
        GAME_CONFIG.INITIAL_STATE.MAX_BET
      );
      onChangeBet(newBet);
    }
  }, [betAmount, onChangeBet, disabled, getBetStep]);

  const handleDecreaseBet = useCallback(() => {
    if (!disabled && betAmount > GAME_CONFIG.INITIAL_STATE.MIN_BET) {
      const step = getBetStep(betAmount);
      const newBet = Math.max(
        Math.round((betAmount - step) * 100) / 100,
        GAME_CONFIG.INITIAL_STATE.MIN_BET
      );
      onChangeBet(newBet);
    }
  }, [betAmount, onChangeBet, disabled, getBetStep]);

  const labelStyle = new TextStyle({
    fill: 0xa0a3ff,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "Poppins, sans-serif",
  });

  const amountStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Poppins, sans-serif",
  });

  const symbolStyle = new TextStyle({
    fill: "7471c4",
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Poppins, sans-serif",
  });

  const leftX = -panelWidth / 2 + 24;
  const buttonSpacing = 50;

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawBackground} />

      <Container position={[leftX, -30]}>
        <Text
          text="BET AMOUNT (USD)"
          anchor={[0, 0]}
          style={labelStyle}
          alpha={0.7}
        />
        <Text
          text={formatCurrency(betAmount)}
          position={[0, 25]}
          anchor={[0, 0]}
          style={amountStyle}
          alpha={0.7}
        />
      </Container>

      <Container position={[panelWidth / 2 - 80, 0]}>
        <Container
          position={[-buttonSpacing / 2 - 5, 0]}
          eventMode={disabled ? "none" : "static"}
          cursor="pointer"
          pointerdown={handleDecreaseBet}
        >
          <Graphics draw={drawButton} />
          <Text text="−" anchor={[0.5, 0.5]} style={symbolStyle} />
        </Container>

        <Container
          position={[buttonSpacing / 2 + 5, 0]}
          eventMode={disabled ? "none" : "static"}
          cursor="pointer"
          pointerdown={handleIncreaseBet}
        >
          <Graphics draw={drawButton} />
          <Text text="+" anchor={[0.5, 0.5]} style={symbolStyle} />
        </Container>
      </Container>
    </Container>
  );
};
