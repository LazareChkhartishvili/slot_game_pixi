import { useEffect, useRef } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

export const useKonamiCode = () => {
  const konamiCodeRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      konamiCodeRef.current.push(e.key);
      if (konamiCodeRef.current.length > KONAMI_SEQUENCE.length) {
        konamiCodeRef.current.shift();
      }

      // Check if Konami code is entered
      if (
        konamiCodeRef.current.length === KONAMI_SEQUENCE.length &&
        konamiCodeRef.current.every(
          (key, index) => key === KONAMI_SEQUENCE[index]
        )
      ) {
        // Trigger Konami code bonus
        window.dispatchEvent(
          new CustomEvent("konamiCode", { detail: { bonus: 1000000 } })
        );
        konamiCodeRef.current = []; // Reset
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
};
