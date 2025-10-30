import { useEffect, useState } from "react";

interface SettingsOverlayPayload {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SettingsOverlay = () => {
  const [open, setOpen] = useState(false);
  const [bounds, setBounds] = useState<SettingsOverlayPayload | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const custom = e as CustomEvent<SettingsOverlayPayload>;
      setBounds(custom.detail || null);
      setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);

    window.addEventListener("settingsOpen", handleOpen as EventListener);
    window.addEventListener("settingsClose", handleClose as EventListener);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("settingsOpen", handleOpen as EventListener);
      window.removeEventListener("settingsClose", handleClose as EventListener);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!open) return null;

  const panelWidth = bounds?.width ?? Math.min(900, window.innerWidth - 40);
  const panelHeight = bounds?.height ?? Math.min(600, window.innerHeight - 80);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={() => setOpen(false)}
    >
      <div
        className={`relative flex flex-col text-white rounded-2xl border border-indigo-400/40
        shadow-[0_10px_40px_rgba(0,0,0,0.6),_inset_0_0_30px_rgba(99,102,241,0.25)]
        bg-gradient-to-b from-[#181b30] to-[#0f1122]
        max-w-[calc(100vw-40px)] max-h-[calc(100vh-80px)]
        overflow-hidden w-[${panelWidth}px] h-[${panelHeight}px]
        scale-95 opacity-0 animate-popup`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-indigo-500/25 px-6 py-4 bg-gradient-to-b from-indigo-400/10 to-transparent">
          <h2 className="font-poppins font-extrabold uppercase tracking-wider text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Settings
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-xl"
          >
            ✕
          </button>

          {/* subtle moving light */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent animate-scan" />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid gap-5 text-sm md:text-base">
          {/* Keyboard Shortcuts */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner">
            <h3 className="font-poppins font-semibold mb-3 text-indigo-300">
              Keyboard Shortcuts
            </h3>
            <ul className="space-y-2">
              {[
                ["SPACE", "Spin / Play"],
                ["S", "Open Settings"],
                ["M", "Toggle Music"],
                ["F", "Toggle Fast Speed"],
                ["A", "Toggle Auto Spin"],
                ["← / →", "Decrease / Increase Bet"],
              ].map(([key, desc]) => (
                <li
                  key={key}
                  className="grid grid-cols-[130px_1fr] gap-3 items-center"
                >
                  <span className="px-3 py-2 rounded-md border border-white/10 bg-gradient-to-b from-[#2b2e45] to-[#20243a] font-semibold text-center text-sm md:text-base transition hover:scale-[1.03] hover:border-indigo-400/40">
                    {key}
                  </span>
                  <span className="text-indigo-200">{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Easter Eggs */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner">
            <h3 className="font-poppins font-semibold mb-3 text-indigo-300">
              Easter Eggs
            </h3>
            <p className="text-indigo-200 mb-2">
              Enter ↑ ↑ ↓ ↓ ← → ← → to get a $1,000,000 bonus.
            </p>
            <p className="text-indigo-200">
              Click comets in the background to explode them!
            </p>
          </section>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes popup {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-popup {
          animation: popup 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
          mix-blend-mode: screen;
          opacity: 0.2;
        }
      `}</style>
    </div>
  );
};
