type InputEventName =
  | "spin"
  | "openSettings"
  | "toggleMusic"
  | "toggleFast"
  | "toggleAuto"
  | "decreaseBet"
  | "increaseBet"
  | "konami";

class InputControllerClass extends EventTarget {
  private enabled: boolean = true;
  private isAutoSpinning: boolean = false;
  private uiDisabled: boolean = false;
  private balance: number = Infinity;
  private betAmount: number = 0;

  private konamiBuffer: string[] = [];
  private readonly konamiSeq = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];

  constructor() {
    super();
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown, {
        passive: false,
      });
    }
  }

  updateGuards(params: {
    uiDisabled?: boolean;
    isAutoSpinning?: boolean;
    balance?: number;
    betAmount?: number;
  }) {
    if (params.uiDisabled !== undefined) this.uiDisabled = params.uiDisabled;
    if (params.isAutoSpinning !== undefined)
      this.isAutoSpinning = params.isAutoSpinning;
    if (params.balance !== undefined) this.balance = params.balance;
    if (params.betAmount !== undefined) this.betAmount = params.betAmount;
  }

  setEnabled(value: boolean) {
    this.enabled = value;
  }

  private emit(name: InputEventName) {
    this.dispatchEvent(new Event(name));
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;

    const { code, key } = e;

    // Konami detection (always record)
    this.konamiBuffer.push(key);
    if (this.konamiBuffer.length > this.konamiSeq.length) {
      this.konamiBuffer.shift();
    }
    if (
      this.konamiBuffer.length === this.konamiSeq.length &&
      this.konamiBuffer.every((k, i) => k === this.konamiSeq[i])
    ) {
      this.emit("konami");
      this.konamiBuffer = [];
    }

    // Guards
    const canAct = !this.uiDisabled;
    const canSpin =
      canAct && !this.isAutoSpinning && this.balance >= this.betAmount;
    const canAuto = canAct && this.balance >= this.betAmount;

    if (code === "Space" || key === " ") {
      e.preventDefault();
      if (canSpin) this.emit("spin");
      return;
    }
    if (code === "KeyS" || key === "s" || key === "S") {
      e.preventDefault();
      this.emit("openSettings");
      return;
    }
    if (code === "KeyM" || key === "m" || key === "M") {
      e.preventDefault();
      this.emit("toggleMusic");
      return;
    }
    if (code === "KeyF" || key === "f" || key === "F") {
      e.preventDefault();
      if (canAct) this.emit("toggleFast");
      return;
    }
    if (code === "KeyA" || key === "a" || key === "A") {
      e.preventDefault();
      if (canAuto) this.emit("toggleAuto");
      return;
    }
    if (code === "ArrowLeft") {
      e.preventDefault();
      if (canAct) this.emit("decreaseBet");
      return;
    }
    if (code === "ArrowRight") {
      e.preventDefault();
      if (canAct) this.emit("increaseBet");
      return;
    }
  };
}

export const InputController = new InputControllerClass();
