import { useEffect, useState, useCallback, memo } from "react";
import { KEYBOARD_SHORTCUTS } from "../../constants/keyboard";

export const SettingsOverlay = memo(() => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("settingsOpen", handleOpen);
    window.addEventListener("settingsClose", handleClose);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("settingsOpen", handleOpen);
      window.removeEventListener("settingsClose", handleClose);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative flex flex-col text-white rounded-2xl border border-indigo-400/40
        shadow-[0_10px_40px_rgba(0,0,0,0.6),_inset_0_0_30px_rgba(99,102,241,0.25)]
        bg-gradient-to-b from-[#181b30] to-[#0f1122]
        max-w-[calc(100vw-40px)] max-h-[calc(100vh-80px)]
        overflow-hidden w-full h-full md:w-[900px] md:h-[600px]
        animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-indigo-500/25 px-6 py-4 bg-gradient-to-b from-indigo-400/10 to-transparent">
          <h2 className="font-poppins font-extrabold uppercase tracking-wider text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Settings
          </h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-xl"
          >
            ✕
          </button>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent animate-[scan_6s_linear_infinite] mix-blend-screen opacity-20" />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid gap-5 text-sm md:text-base">
          {/* Keyboard Shortcuts */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner">
            <h3 className="font-poppins font-semibold mb-3 text-indigo-300">
              Keyboard Shortcuts
            </h3>
            <ul className="space-y-2">
              {KEYBOARD_SHORTCUTS.map(([key, desc]) => (
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

      <style>{`
        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
});
