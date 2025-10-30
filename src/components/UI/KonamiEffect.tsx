import { useEffect, useState } from "react";

export const KonamiEffect = () => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    const handleKonamiCode = () => {
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 4000);
    };

    window.addEventListener("konamiCode", handleKonamiCode as EventListener);
    return () =>
      window.removeEventListener(
        "konamiCode",
        handleKonamiCode as EventListener
      );
  }, []);

  if (!showEffect) return null;

  return (
    <>
      <div className="konami-overlay">
        <div className="konami-message">
          <div className="konami-title">KONAMI CODE ACTIVATED!</div>
          <div className="konami-amount">+$1,000,000</div>
          <div className="konami-sparkles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={
                  {
                    "--delay": `${i * 0.1}s`,
                    "--angle": `${i * 18}deg`,
                    left: "50%",
                    top: "50%",
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .konami-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 9999;
        }
        .konami-message {
          text-align: center;
          position: relative;
        }
        .konami-title {
          font-family: 'Poppins', sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: #FFD700;
          text-shadow: 
            0 0 10px #FFD700,
            0 0 20px #FFD700,
            0 0 30px #FFA500,
            0 0 40px #FFA500,
            0 0 50px #FF6347;
          animation: titlePulse 0.8s ease-in-out infinite;
          margin-bottom: 20px;
        }
        .konami-amount {
          font-family: 'Poppins', sans-serif;
          font-size: 72px;
          font-weight: 900;
          background: linear-gradient(45deg, #FFD700, #FFA500, #FF6347, #FFD700);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbowFlow 2s ease-in-out infinite, amountPop 0.6s ease-out;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
        }
        .konami-sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #FFD700;
          border-radius: 50%;
          box-shadow: 
            0 0 10px #FFD700,
            0 0 20px #FFA500;
          animation: sparkleFly 2s ease-out forwards;
        }
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
};
