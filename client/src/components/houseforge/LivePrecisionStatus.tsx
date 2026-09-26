import { useEffect, useState } from "react";

export function LivePrecisionStatus() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0;
    let start = performance.now();
    let frame = 0;
    const onMove = (event: PointerEvent) => setPointer({ x: event.clientX, y: event.clientY });
    const tick = (now: number) => {
      frames += 1;
      if (now - start >= 1000) { setFps(Math.round((frames * 1000) / (now - start))); frames = 0; start = now; }
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(frame); };
  }, []);

  return <div className="hf-live-precision" aria-live="polite"><span><i />LIVE</span><span>CURSOR {pointer.x}, {pointer.y}</span><span>{fps} FPS</span></div>;
}
