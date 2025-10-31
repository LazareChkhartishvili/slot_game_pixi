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
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2a] to-[#0a0a1a]">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/logo.png"
          alt="Slot Game Logo"
          className="w-56 h-auto animate-pulse"
        />
      </div>

      {/* Loading Title */}
      <div className="mb-6">
        <h1 className="font-poppins text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
          LOADING
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-96 mb-4">
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden border-2 border-purple-500/40 shadow-lg shadow-purple-500/20">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-purple-300 font-poppins text-sm mb-8">
        {total && loaded !== undefined ? (
          <span>
            Loading assets... {loaded}/{total} ({progress}%)
          </span>
        ) : (
          <span>Loading... {progress}%</span>
        )}
      </div>

      {/* Spinning icon */}
      <div className="mt-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};
