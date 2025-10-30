import { Container, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";

import type { BalanceDisplayProps } from "../../types";
import { formatCurrency } from "../../helper/formatCurrency";

export const BalancePanel = ({
  x,
  y,
  balance,
  lastWin,
}: BalanceDisplayProps) => {
  const labelStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 16,
    fontWeight: "bolder",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: 1,
  });
  const amountStyle = new TextStyle({
    fill: 0x00ff00,
    fontSize: 16,
    fontWeight: "bolder",
    fontFamily: "Poppins, sans-serif",
  });

  const winStyle = new TextStyle({
    fill: 0xffff00,
    fontSize: 18,
    fontWeight: "bolder",
    fontFamily: "Poppins, sans-serif",
  });

  return (
    <Container position={[x, y]}>
      <Text text="BALANCE" anchor={[0, 0]} style={labelStyle} alpha={0.7} />

      <Text
        text={formatCurrency(balance)}
        position={[0, 35]}
        anchor={[0, 0.5]}
        style={amountStyle}
        alpha={0.5}
      />

      {lastWin > 0 && (
        <Text
          text={`+${formatCurrency(lastWin)}`}
          position={[0, 60]}
          anchor={[0, 0.5]}
          style={winStyle}
          alpha={1.0}
        />
      )}
    </Container>
  );
};
