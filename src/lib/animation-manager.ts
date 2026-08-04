'use client';

type FrameCallback = (now: number, delta: number) => void;

class AnimationManager {
  private readonly subscribers = new Map<number, FrameCallback>();
  private pauseListeners = new Set<(paused: boolean) => void>();
  private rafId = 0;
  private running = false;
  private last = 0;
  private nextId = 1;
  private isHidden = false;

  constructor() {
    if (typeof document !== 'undefined') {
      this.isHidden = document.hidden;
      document.addEventListener('visibilitychange', this.onVisibility);
    }
  }

  get paused(): boolean {
    return this.isHidden;
  }

  private onVisibility = () => {
    const hidden = document.hidden;
    if (this.isHidden === hidden) return;
    this.isHidden = hidden;
    if (hidden) {
      this.running = false;
      this.last = 0;
      cancelAnimationFrame(this.rafId);
    } else if (this.subscribers.size > 0) {
      this.start();
    }
    for (const cb of this.pauseListeners) cb(hidden);
  };

  private start() {
    if (this.running || this.isHidden) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const delta = this.last === 0 ? 16 : now - this.last;
    this.last = now;
    for (const cb of this.subscribers.values()) {
      try {
        cb(now, delta);
      } catch {
        /* noop */
      }
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  subscribe(cb: FrameCallback): () => void {
    const id = this.nextId++;
    this.subscribers.set(id, cb);
    if (this.subscribers.size === 1) this.start();
    return () => {
      this.subscribers.delete(id);
      if (this.subscribers.size === 0) {
        this.running = false;
        this.last = 0;
        cancelAnimationFrame(this.rafId);
      }
    };
  }

  onPauseChange(cb: (paused: boolean) => void): () => void {
    this.pauseListeners.add(cb);
    return () => {
      this.pauseListeners.delete(cb);
    };
  }
}

export const animationManager = new AnimationManager();
