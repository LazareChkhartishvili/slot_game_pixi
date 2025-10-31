/**
 * Loading screen with progress bar
 */

interface LoadingScreenProps {
  progress: number;
  total?: number;
  loaded?: number;
}

export const LoadingScreen = ({
  progress,
  total,
  loaded,
}: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#1a0a2a]">
      {/* Logo or Title */}
      <div className="mb-8">
        <h1 className="font-poppins text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-pulse">
          SLOT GAME
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-80 mb-4">
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-gray-400 font-poppins text-sm">
        {total && loaded !== undefined ? (
          <span>
            Loading assets... {loaded}/{total} ({progress}%)
          </span>
        ) : (
          <span>Loading... {progress}%</span>
        )}
      </div>

      {/* Spinning icon */}
      <div className="mt-8">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};
