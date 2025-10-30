import { Stage } from "@pixi/react";
import { useStageDimensions } from "./hooks/useStageDimensions";
import { GameBackground } from "./components/UI";

const App = () => {
  const dimensions = useStageDimensions();
  return (
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
    </Stage>
  );
};

export default App;
