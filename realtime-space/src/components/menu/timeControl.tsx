import { useState, useRef, useEffect, useCallback, type CSSProperties, type RefObject } from "react";

export const SPEEDS: number[] = [
  -2592000, -604800, -86400, -3600, -60, -1,
  1, 60, 3600, 86400, 604800, 2592000,
];

const UNITS: [number, string][] = [
  [2592000, "30 days"],
  [604800, "1 week"],
  [86400, "1 day"],
  [3600, "1 hour"],
  [60, "1 min"],
  [1, "1 sec"],
];

export function speedLabel(s: number): string {
  if (s === 1) return "Real time";
  if (s === -1) return "Real time, reversed";
  const unit = UNITS.find(([v]) => v === Math.abs(s));
  const text = unit ? `${unit[1]} / s` : `${Math.abs(s)}× real time`;
  return s < 0 ? `−${text}` : text;
}

export type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface SimClock {
  /** Simulated time in ms since epoch (UTC). Updates ~10 Hz for React. */
  time: number;
  /** Exact simulated time, updated every frame. Read this in render loops. */
  timeRef: RefObject<number>;
  /** Simulated seconds per real second. Negative runs backwards. */
  speedRef: RefObject<number>;
  speed: number;
  paused: boolean;
  setTime: (ms: number) => void;
  setSpeed: (s: number) => void;
  setPaused: (p: boolean) => void;
}

export interface SimClockOptions {
  start?: number;
  speed?: number;
  paused?: boolean;
}

/* ------------------------------------------------------------------ */
/* useSimClock: owns the simulation clock.                            */
/*                                                                    */
/*   const clock = useSimClock();                                     */
/*   // in your render loop (no re-render needed):                    */
/*   const t = clock.timeRef.current;   // ms since epoch (UTC)       */
/*   // in React UI:                                                  */
/*   clock.time, clock.speed, clock.paused                            */
/* ------------------------------------------------------------------ */
export function useSimClock({ start = Date.now(), speed = 1, paused = false }: SimClockOptions = {}): SimClock {
  const timeRef = useRef<number>(start);
  const speedRef = useRef<number>(speed);
  const pausedRef = useRef<boolean>(paused);

  const [time, setTimeState] = useState(start);
  const [speedState, setSpeedState] = useState(speed);
  const [pausedState, setPausedState] = useState(paused);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) timeRef.current += dt * speedRef.current * 1000;
      // Throttle React updates to ~10 Hz; timeRef is always exact.
      if (now - lastPaint > 100) {
        lastPaint = now;
        setTimeState(timeRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setSpeed = useCallback((s: number) => {
    speedRef.current = s;
    setSpeedState(s);
  }, []);
  const setPaused = useCallback((p: boolean) => {
    pausedRef.current = p;
    setPausedState(p);
  }, []);
  const setTime = useCallback((ms: number) => {
    timeRef.current = ms;
    setTimeState(ms);
  }, []);

  return { time, timeRef, speedRef, speed: speedState, paused: pausedState, setTime, setSpeed, setPaused };
}
interface TimeControlProps {
  clock: SimClock;
  corner?: Corner;
  defaultOpen?: boolean;
}

export default function TimeControl({ clock, corner = "bottom-right", defaultOpen = false }: TimeControlProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { time, speed, paused, setTime, setSpeed, setPaused } = clock;

  const d = new Date(time);
  const dateText = d.toISOString().slice(0, 10);
  const timeText = d.toISOString().slice(11, 19);
  const idx = SPEEDS.indexOf(speed);

  const step = (dir: -1 | 1) => {
    const i = idx === -1 ? SPEEDS.findIndex((s) => s > 0) : idx;
    const next = Math.min(SPEEDS.length - 1, Math.max(0, i + dir));
    setSpeed(SPEEDS[next]);
  };

  const pos: CSSProperties = {
    position: "fixed",
    [corner.startsWith("top") ? "top" : "bottom"]: "max(16px, env(safe-area-inset-top, 0px))",
    [corner.endsWith("left") ? "left" : "right"]: 16,
  };

  return (
    <div className="tc" style={pos} role="group" aria-label="Simulation time">
      <style>{CSS}</style>

      {open && (
        <div className="tc-panel">
          <div className="tc-row">
            <button className="tc-btn" onClick={() => step(-1)} disabled={idx === 0} aria-label="Slower or reverse">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3 2 8l6 5zM14 3 8 8l6 5z" fill="currentColor" /></svg>
            </button>
            <button className="tc-btn tc-play" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume" : "Pause"}>
              {paused ? (
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" fill="currentColor" /></svg>
              )}
            </button>
            <button className="tc-btn" onClick={() => step(1)} disabled={idx === SPEEDS.length - 1} aria-label="Faster">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 3l6 5-6 5zM8 3l6 5-6 5z" fill="currentColor" /></svg>
            </button>
            <div className="tc-speed" aria-live="polite">{paused ? "Paused" : speedLabel(speed)}</div>
          </div>

          <label className="tc-field">
            <span>Jump to (UTC)</span>
            <input
              type="datetime-local"
              value={d.toISOString().slice(0, 16)}
              onChange={(e) => {
                const ms = Date.parse(e.target.value + "Z");
                if (!Number.isNaN(ms)) setTime(ms);
              }}
            />
          </label>

          <button
            className="tc-now"
            onClick={() => { setTime(Date.now()); setSpeed(1); setPaused(false); }}
          >
            Reset to now
          </button>
        </div>
      )}

      <button className="tc-pill" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={"tc-dot" + (paused ? " tc-dot-paused" : "")} aria-hidden="true" />
        <span className="tc-date">{dateText}</span>
        <span className="tc-clock">{timeText}</span>
        <span className="tc-utc">UTC</span>
      </button>
    </div>
  );
}

const CSS = `
.tc {
  --tc-bg: rgba(10, 14, 28, 0.82);
  --tc-line: rgba(160, 180, 230, 0.22);
  --tc-ink: #e8ecf8;
  --tc-dim: #8b97b8;
  --tc-accent: #ffb454;
  z-index: 1000;
  display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  font: 13px/1.3 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  color: var(--tc-ink);
}
.tc-pill, .tc-panel {
  background: var(--tc-bg);
  border: 1px solid var(--tc-line);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tc-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; color: inherit; cursor: pointer; font: inherit;
  font-variant-numeric: tabular-nums;
}
.tc-date { color: var(--tc-dim); }
.tc-clock { color: var(--tc-accent); font-weight: 600; letter-spacing: 0.02em; }
.tc-utc { color: var(--tc-dim); font-size: 11px; }
.tc-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--tc-accent); }
.tc-dot-paused { background: transparent; border: 1.5px solid var(--tc-dim); }
.tc-panel { padding: 12px; width: 248px; display: flex; flex-direction: column; gap: 12px; }
.tc-row { display: flex; align-items: center; gap: 6px; }
.tc-btn {
  width: 34px; height: 34px; display: grid; place-items: center;
  background: rgba(160, 180, 230, 0.1); color: var(--tc-ink);
  border: 1px solid transparent; border-radius: 8px; cursor: pointer;
}
.tc-btn:hover:not(:disabled) { background: rgba(160, 180, 230, 0.2); }
.tc-btn:disabled { opacity: 0.35; cursor: default; }
.tc-play { background: var(--tc-accent); color: #1a1204; }
.tc-play:hover:not(:disabled) { background: #ffc275; }
.tc-speed { margin-left: auto; font-variant-numeric: tabular-nums; text-align: right; }
.tc-field { display: flex; flex-direction: column; gap: 4px; color: var(--tc-dim); font-size: 12px; }
.tc-field input {
  background: rgba(160, 180, 230, 0.08); color: var(--tc-ink);
  border: 1px solid var(--tc-line); border-radius: 8px; padding: 7px 8px;
  font: inherit; color-scheme: dark;
}
.tc-now {
  background: none; color: var(--tc-ink); border: 1px solid var(--tc-line);
  border-radius: 8px; padding: 7px; cursor: pointer; font: inherit;
}
.tc-now:hover { background: rgba(160, 180, 230, 0.12); }
.tc button:focus-visible, .tc input:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 2px; }
`;
