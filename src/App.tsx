import { Stage } from "@pixi/react";
import { useStageDimensions } from "./hooks/useStageDimensions";
import { useKonamiHandler } from "./hooks/useKonamiHandler";
import { useAssetPreloader } from "./hooks/useAssetPreloader";
import { GameBackground } from "./components/UI";
import { SlotGameContainer } from "./components/Game/SlotGameContainer";
import { KonamiEffect } from "./components/UI/KonamiEffect";
import { SettingsOverlay } from "./components/UI/SettingsOverlay";
import { LoadingScreen } from "./components/UI/LoadingScreen";

const App = () => {
  const dimensions = useStageDimensions();
  useKonamiHandler();
  const { isLoading, loadProgress } = useAssetPreloader();

  if (isLoading) {
    return (
      <LoadingScreen
        progress={loadProgress.percentage}
        total={loadProgress.total}
        loaded={loadProgress.loaded}
      />
    );
  }
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
