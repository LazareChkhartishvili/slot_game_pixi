import { ToggleIconButton } from "./ToggleIconButton";

interface FastSpeedButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const FastSpeedButton = (props: FastSpeedButtonProps) => {
  return (
    <ToggleIconButton
      {...props}
      activeIconPath="/images/symbols/fast_icon_red.png"
      inactiveIconPath="/images/symbols/fast_icon_blue.png"
    />
  );
};
