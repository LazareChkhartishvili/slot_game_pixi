import { useEffect, useState, useCallback, memo } from "react";

const SPARKLE_INDICES = Array.from({ length: 20 }, (_, i) => i);

export const KonamiEffect = memo(() => {
  const [showEffect, setShowEffect] = useState(false);

  const handleKonamiCode = useCallback(() => {
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 4000);
  }, []);

  useEffect(() => {
    window.addEventListener("konamiCode", handleKonamiCode as EventListener);
    return () =>
      window.removeEventListener(
        "konamiCode",
        handleKonamiCode as EventListener
      );
  }, [handleKonamiCode]);

  if (!showEffect) return null;

  return (
    <>
      <div className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none">
        <div className="text-center relative">
          {/* Title */}
          <div
            className="font-poppins text-5xl font-black mb-5 animate-[titlePulse_0.8s_ease-in-out_infinite]"
            style={{
              color: "#FFD700",
              textShadow:
                "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFA500, 0 0 40px #FFA500, 0 0 50px #FF6347",
            }}
          >
            KONAMI CODE ACTIVATED!
          </div>

          {/* Amount */}
          <div
            className="font-poppins text-7xl font-black bg-clip-text text-transparent animate-[rainbowFlow_2s_ease-in-out_infinite,amountPop_0.6s_ease-out]"
            style={{
              background:
                "linear-gradient(45deg, #FFD700, #FFA500, #FF6347, #FFD700)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
            }}
          >
            +$1,000,000
          </div>

          {/* Sparkles */}
          <div className="absolute inset-0 w-full h-full">
            {SPARKLE_INDICES.map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#FFD700,0_0_20px_#FFA500] animate-[sparkleFly_2s_ease-out_forwards]"
                style={
                  {
                    left: "50%",
                    top: "50%",
                    animationDelay: `${i * 0.1}s`,
                    "--angle": `${i * 18}deg`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes titlePulse {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.1);
            filter: brightness(1.5);
          }
        }
        @keyframes rainbowFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes amountPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes sparkleFly {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * 200px),
              calc(sin(var(--angle)) * 200px)
            ) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
});
