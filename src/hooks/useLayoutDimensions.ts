import { useMemo } from "react";
import type { Size } from "../types";

export const useLayoutDimensions = ({ width, height }: Size) => {
  return useMemo(() => {
    const slotMachineWidth = width * 0.51;
    const slotMachineHeight = height * 0.6;
    const slotMachinePosition = {
      x: width * 0.4,
      y: height * 0.5,
    };

    const rightPanelX = width * 0.78;
    const betControlsY = height * 0.54;

    const buttonGroupX = rightPanelX - 30;
    const buttonGroupY = height * 0.7;

    const leftButtonsX = buttonGroupX - 100;
    const autoSpinButtonX = leftButtonsX;
    const autoSpinButtonY = buttonGroupY - 39;
    const fastSpeedButtonX = leftButtonsX;
    const fastSpeedButtonY = buttonGroupY + 39;

    const spinButtonX = buttonGroupX + 80;
    const spinButtonY = buttonGroupY;

    const balanceX = width * 0.15;
    const balanceY = height * 0.81;

    const logoX = width * 0.12;
    const logoY = height * 0.05;
    const logoWidth = width * 0.15;
    const logoHeight = height * 0.12;

    const musicIconX = width * 0.84;
    const musicIconY = height * 0.12;

    const settingsIconX = musicIconX - 50;
    const settingsIconY = musicIconY;

    const textBelowSlotMachineY =
      slotMachinePosition.y + slotMachineHeight / 2 + 20;
    const textBelowSlotMachineX = slotMachinePosition.x;

    return {
      slotMachineWidth,
      slotMachineHeight,
      slotMachinePosition,
      rightPanelX,
      betControlsY,
      buttonGroupX,
      buttonGroupY,
      autoSpinButtonX,
      autoSpinButtonY,
      fastSpeedButtonX,
      fastSpeedButtonY,
      spinButtonX,
      spinButtonY,
      balanceX,
      balanceY,
      logoX,
      logoY,
      logoWidth,
      logoHeight,
      musicIconX,
      musicIconY,
      settingsIconX,
      settingsIconY,
      textBelowSlotMachineX,
      textBelowSlotMachineY,
    };
  }, [width, height]);
};
