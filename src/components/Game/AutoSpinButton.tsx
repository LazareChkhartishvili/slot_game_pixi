import { ToggleIconButton } from "./ToggleIconButton";

interface AutoSpinButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const AutoSpinButton = (props: AutoSpinButtonProps) => {
  return (
    <ToggleIconButton
      {...props}
      activeIconPath="/images/symbols/auto_icon_red.png"
      inactiveIconPath="/images/symbols/auto_icon_blue.png"
    />
  );
};
