type Subscriber = (dt: number, t: number) => void;

class AnimationLoopClass {
  private subscribers = new Set<Subscriber>();
  private rafId: number | null = null;
  private lastTime: number = 0;

  start() {
    if (this.rafId !== null) return;
    this.lastTime = 0;
    const tick = (time: number) => {
      if (!this.lastTime) this.lastTime = time;
      const dt = time - this.lastTime;
      this.lastTime = time;
      for (const sub of this.subscribers) sub(dt, time);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    this.start();
    return () => {
      this.subscribers.delete(fn);
      if (this.subscribers.size === 0) this.stop();
    };
  }
}

export const AnimationLoop = new AnimationLoopClass();
