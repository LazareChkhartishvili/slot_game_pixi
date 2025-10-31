import { useEffect } from "react";
import { InputController } from "../controllers/InputController";

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
