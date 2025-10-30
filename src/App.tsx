import { Stage } from "@pixi/react";
import { useStageDimensions } from "./hooks/useStageDimensions";
import { GameBackground } from "./components/UI";
import { SlotGameContainer } from "./components/Game/SlotGameContainer";
import { InputController } from "./controllers/InputController";
import { useEffect } from "react";
import { KonamiEffect } from "./components/UI/KonamiEffect";
import { SettingsOverlay } from "./components/UI/SettingsOverlay";

const App = () => {
  const dimensions = useStageDimensions();
  useEffect(() => {
    const handler = () => {
      window.dispatchEvent(
        new CustomEvent("konamiCode", { detail: { bonus: 1000000 } })
      );
    };
    InputController.addEventListener("konami", handler as EventListener);
    return () =>
      InputController.removeEventListener("konami", handler as EventListener);
  }, []);
  return (
    <>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        options={{
          autoDensity: true,
          resizeTo: window,
          backgroundColor: 0x0b0c1c,
        }}
      >
        <GameBackground width={dimensions.width} height={dimensions.height} />
        <SlotGameContainer
          width={dimensions.width}
          height={dimensions.height}
        />
      </Stage>
      <KonamiEffect />
      <SettingsOverlay />
    </>
  );
};

export default App;
