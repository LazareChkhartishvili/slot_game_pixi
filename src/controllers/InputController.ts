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

  cleanup() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
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

  private normalizeKey(code: string, key: string): string {
    const keyMap: Record<string, string> = {
      Space: "SPACE",
      " ": "SPACE",
      KeyS: "S",
      s: "S",
      S: "S",
      KeyM: "M",
      m: "M",
      M: "M",
      KeyF: "F",
      f: "F",
      F: "F",
      KeyA: "A",
      a: "A",
      A: "A",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
    };

    return keyMap[code] || keyMap[key] || "";
  }

  private checkGuards(action: InputEventName): boolean {
    const canAct = !this.uiDisabled;
    const hasBalance = this.balance >= this.betAmount;

    switch (action) {
      case "spin":
        return canAct && !this.isAutoSpinning && hasBalance;
      case "toggleFast":
      case "decreaseBet":
      case "increaseBet":
        return canAct;
      case "toggleAuto":
      case "openSettings":
      case "toggleMusic":
      case "konami":
        return true;
      default:
        return false;
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;

    const { code, key } = e;

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

    const normalizedKey = this.normalizeKey(code, key);
    if (!normalizedKey) return;

    e.preventDefault();

    let action: InputEventName | null = null;

    switch (normalizedKey) {
      case "SPACE":
        action = "spin";
        break;
      case "S":
        action = "openSettings";
        break;
      case "M":
        action = "toggleMusic";
        break;
      case "F":
        action = "toggleFast";
        break;
      case "A":
        action = "toggleAuto";
        break;
      case "LEFT":
        action = "decreaseBet";
        break;
      case "RIGHT":
        action = "increaseBet";
        break;
    }

    if (action && this.checkGuards(action)) {
      this.emit(action);
    }
  };
}

export const InputController = new InputControllerClass();
