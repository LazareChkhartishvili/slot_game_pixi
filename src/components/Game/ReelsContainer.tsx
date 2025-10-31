import { Container } from "@pixi/react";
import { useCallback, useRef, useEffect, useMemo } from "react";
import type { ReelGrid } from "../../types";
import { ReelColumn } from "./ReelColumn";

export const ReelsContainer = ({
  x,
  y,
  columns,
  rows,
  cellWidth,
  cellHeight,
  isSpinning,
  reelPositions,
  winningPositions = [],
  fastMode = false,
}: ReelGrid) => {
  const spinningRef = useRef(isSpinning);
  const isStoppingRef = useRef(false);

  // Memoize column indices array to prevent recreation
  const columnIndices = useMemo(
    () => Array.from({ length: columns }, (_, i) => i),
    [columns]
  );

  const generateRandomSymbols = useCallback((count: number) => {
    return Array.from({ length: count * 3 }, () =>
      Math.floor(Math.random() * 7)
    );
  }, []);

  // Reset stopping counter when spinning starts or stops
  useEffect(() => {
    if (isSpinning && !spinningRef.current) {
      isStoppingRef.current = false;
    }

    if (!isSpinning && spinningRef.current) {
      isStoppingRef.current = true;
    }

    spinningRef.current = isSpinning;
  }, [isSpinning]);

  const initialReelSymbols = useRef(
    Array(columns)
      .fill(null)
      .map(() => generateRandomSymbols(rows + 2))
  );

  return (
    <Container position={[x, y]}>
      {columnIndices.map((columnIndex) => {
        // Get the target symbols for this reel
        const targetPositions: number[] | undefined = reelPositions
          ? reelPositions[columnIndex]
          : undefined;

        // Find winning positions in this reel
        const reelWinningPositions = winningPositions.filter(
          ([colIndex]) => colIndex === columnIndex
        );

        return (
          <ReelColumn
            key={`reel-${columnIndex}`}
            x={columnIndex * cellWidth}
            y={0}
            width={cellWidth}
            height={cellHeight * rows}
            symbolCount={rows}
            symbols={initialReelSymbols.current[columnIndex] || []}
            isSpinning={isSpinning}
            reelIndex={columnIndex}
            targetPositions={targetPositions}
            winningPositions={reelWinningPositions}
            anyWinningSymbolsInGame={winningPositions.length > 0}
            fastMode={fastMode}
          />
        );
      })}
    </Container>
  );
};
