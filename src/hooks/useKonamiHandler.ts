import { useEffect } from "react";
import { InputController } from "../controllers/InputController";

/**
 * Hook to handle Konami code detection from InputController
 * Dispatches a custom "konamiCode" event on window when Konami code is detected
 */
export const useKonamiHandler = () => {
  useEffect(() => {
    const handler = () => {
      window.dispatchEvent(
        new CustomEvent("konamiCode", { detail: { bonus: 1000000 } })
      );
    };

    InputController.addEventListener("konami", handler as EventListener);
    return () => {
      InputController.removeEventListener("konami", handler as EventListener);
    };
  }, []);
};

