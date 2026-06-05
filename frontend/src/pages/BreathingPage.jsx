import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

  /* ── Reset inside breathing page ── */
  .bp-root *, .bp-root *::before, .bp-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  /* ── Keyframes ── */
  @keyframes bp-blob1 {
    0%,100% { transform:translate(0,0)      scale(1);    }
    25%     { transform:translate(12%,-14%) scale(1.12); }
    50%     { transform:translate(-8%,16%)  scale(0.93); }
    75%     { transform:translate(6%,8%)    scale(1.06); }
  }
  @keyframes bp-blob2 {
    0%,100% { transform:translate(0,0)      scale(1);   }
    30%     { transform:translate(-14%,10%) scale(1.15); }
    60%     { transform:translate(10%,-12%) scale(0.9);  }
  }
  @keyframes bp-blob3 {
    0%,100% { transform:translate(0,0)    scale(1);    }
    40%     { transform:translate(8%,14%) scale(1.08); }
    80%     { transform:translate(-6%,-8%) scale(0.96); }
  }
  @keyframes bp-blob4 {
    0%,100% { transform:translate(0,0)      scale(1);   }
    35%     { transform:translate(-10%,-12%) scale(1.1); }
    70%     { transform:translate(12%,8%)   scale(0.92); }
  }
  @keyframes bp-particle {
    0%   { transform:translateY(0);      opacity:0.6; }
    100% { transform:translateY(-110vh); opacity:0;   }
  }
  @keyframes bp-fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes bp-fadeDown {
    from { opacity:1; transform:translateY(0);     }
    to   { opacity:0; transform:translateY(-18px); }
  }
  @keyframes bp-glow {
    0%,100% { text-shadow:0 0 40px rgba(44,172,173,.3), 0 0 80px rgba(2,77,96,.15); }
    50%     { text-shadow:0 0 70px rgba(44,172,173,.55),0 0 130px rgba(2,77,96,.3);  }
  }
  @keyframes bp-lineGrow {
    from { width:0;    opacity:0; }
    to   { width:56px; opacity:1; }
  }
  @keyframes bp-dotPulse {
    0%,100% { opacity:1; transform:scale(1);    }
    50%     { opacity:.5; transform:scale(0.75); }
  }
  @keyframes bp-rp1 {
    0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.88; }
    50%     { transform:translate(-50%,-50%) scale(1.06); opacity:1;   }
  }
  @keyframes bp-rp2 {
    0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.90; }
    50%     { transform:translate(-50%,-50%) scale(1.09); opacity:1;   }
  }
  @keyframes bp-rp3 {
    0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.92; }
    50%     { transform:translate(-50%,-50%) scale(1.12); opacity:1;   }
  }
  @keyframes bp-ro {
    0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.65; }
    50%     { transform:translate(-50%,-50%) scale(1.04); opacity:.88; }
  }

  /* ── Background layer ── */
  .bp-bg {
    position: fixed; inset: 0; z-index: 0;
    overflow: hidden; pointer-events: none;
  }
  .bp-bg-base {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 110%,
      #1C4EA7 0%, #024D60 42%, #021F2E 100%);
  }
  .bp-blob {
    position: absolute; border-radius: 50%; will-change: transform;
  }
  .bp-blob-1 {
    width:min(80vw,780px); height:min(80vw,780px);
    top:-25%; left:-10%;
    background:radial-gradient(circle,rgba(44,172,173,.62) 0%,transparent 68%);
    filter:blur(72px); animation:bp-blob1 20s ease-in-out infinite;
  }
  .bp-blob-2 {
    width:min(70vw,680px); height:min(70vw,680px);
    top:15%; right:-18%;
    background:radial-gradient(circle,rgba(28,78,167,.58) 0%,transparent 66%);
    filter:blur(80px); animation:bp-blob2 26s ease-in-out infinite;
  }
  .bp-blob-3 {
    width:min(60vw,580px); height:min(60vw,580px);
    top:35%; left:22%;
    background:radial-gradient(circle,rgba(117,226,224,.28) 0%,transparent 62%);
    filter:blur(60px); animation:bp-blob3 17s ease-in-out infinite;
  }
  .bp-blob-4 {
    width:min(65vw,640px); height:min(65vw,640px);
    bottom:-20%; left:30%;
    background:radial-gradient(circle,rgba(2,77,96,.7) 0%,transparent 65%);
    filter:blur(90px); animation:bp-blob4 23s ease-in-out infinite;
  }
  .bp-noise {
    position:absolute; inset:0; opacity:.04; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .bp-particle {
    position:absolute; border-radius:50%; pointer-events:none;
    animation:bp-particle linear infinite;
  }

  /* ── Root shell ── */
  .bp-root {
    position: relative; height: 100vh; overflow: hidden;
    background: #021F2E; color: #D9F5F0;
    font-family: 'Jost', sans-serif;
    display: flex; flex-direction: column;
  }

  /* ── Top nav ── */
  .bp-nav {
    position: relative; z-index: 10; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 32px 13px;
    border-bottom: 1px solid rgba(217,245,240,.08);
    background: rgba(1,18,26,.28);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  }
  .bp-nav-brand {
    font-family: 'Cormorant Garamond', serif; font-size: 1.45rem;
    font-weight: 300; letter-spacing: .22em; color: #D9F5F0;
    animation: bp-glow 4s ease-in-out infinite;
  }
  .bp-nav-sub {
    font-size: .58rem; letter-spacing: .3em;
    color: rgba(44,172,173,.55); text-transform: uppercase;
    font-weight: 300; margin-top: 2px; font-family: 'Jost', sans-serif;
  }
  .bp-nav-right {
    display: flex; align-items: center; gap: 14px;
  }
  .bp-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #2CACAD;
    box-shadow: 0 0 10px rgba(44,172,173,.9), 0 0 24px rgba(44,172,173,.4);
    animation: bp-dotPulse 2.4s ease-in-out infinite;
  }
  .bp-back-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 50px;
    background: rgba(44,172,173,.1);
    border: 1px solid rgba(44,172,173,.22);
    color: rgba(217,245,240,.65);
    font-size: .68rem; letter-spacing: .16em; text-transform: uppercase;
    cursor: pointer; font-family: 'Jost',sans-serif; font-weight: 300;
    transition: all .22s ease;
  }
  .bp-back-btn:hover { background:rgba(44,172,173,.2); color:#D9F5F0; }

  /* ── Content area ── */
  .bp-content {
    position: relative; z-index: 1; flex: 1;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; padding: 20px 24px;
  }

  /* ── Screens ── */
  .bp-screen {
    display: none; flex-direction: column; align-items: center;
    width: 100%; max-width: 620px;
  }
  .bp-screen.active { display: flex; }

  /* ── Landing ── */
  .bp-landing { animation: bp-fadeUp 1s ease both; }
  .bp-landing.exiting { animation: bp-fadeDown .65s ease forwards; }

  .bp-heading { text-align: center; margin-bottom: 4px; user-select: none; }
  .bp-h-main {
    display: block; font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(2rem,5vw,2.9rem);
    letter-spacing: .22em; color: #D9F5F0;
    animation: bp-glow 4.5s ease-in-out infinite;
  }
  .bp-h-sub {
    display: block; font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-weight: 300;
    font-size: clamp(.78rem,1.8vw,1rem);
    letter-spacing: .28em; color: rgba(217,245,240,.38); margin-top: 5px;
  }
  .bp-divider {
    width: 0; height: 1px;
    background: linear-gradient(90deg,transparent,rgba(44,172,173,.5),transparent);
    margin: 18px auto; animation: bp-lineGrow .9s .3s ease both;
  }
  .bp-desc {
    font-family: 'Jost',sans-serif; font-size: clamp(.76rem,1.6vw,.86rem);
    font-weight: 200; color: rgba(217,245,240,.52);
    text-align: center; line-height: 2; letter-spacing: .04em;
    max-width: 440px; margin-bottom: 16px;
  }
  .bp-guidelines {
    font-family: 'Jost',sans-serif; font-size: clamp(.66rem,1.4vw,.74rem);
    font-weight: 200; color: rgba(217,245,240,.3);
    text-align: center; line-height: 2.2; letter-spacing: .06em;
    margin-bottom: 28px;
  }
  .bp-guidelines span { display: block; }

  /* ── Glass button ── */
  .bp-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 11px 30px; border-radius: 50px;
    background: rgba(2,40,52,.48);
    border: 1px solid rgba(44,172,173,.32);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    color: rgba(217,245,240,.78);
    font-family: 'Jost',sans-serif; font-size: .72rem; font-weight: 300;
    letter-spacing: .22em; text-transform: lowercase;
    cursor: pointer; outline: none;
    box-shadow: 0 4px 24px rgba(44,172,173,.12);
    transition: all .28s cubic-bezier(.34,1.56,.64,1);
  }
  .bp-btn:hover {
    background: rgba(44,172,173,.18); border-color: rgba(44,172,173,.6);
    color: #D9F5F0; box-shadow: 0 6px 32px rgba(44,172,173,.3);
    transform: translateY(-2px);
  }
  .bp-btn:active { transform: scale(.96); }
  .bp-btn-start {
    padding: 13px 52px; font-size: .76rem; letter-spacing: .30em;
    background: linear-gradient(135deg,rgba(44,172,173,.28) 0%,rgba(2,77,96,.45) 100%);
    border-color: rgba(44,172,173,.45);
    box-shadow: 0 6px 28px rgba(44,172,173,.22);
  }
  .bp-btn-start:hover {
    background: linear-gradient(135deg,rgba(44,172,173,.44) 0%,rgba(2,77,96,.62) 100%);
    box-shadow: 0 10px 40px rgba(44,172,173,.38);
  }
  .bp-controls {
    display: flex; align-items: center; gap: 14px;
    flex-wrap: wrap; justify-content: center;
  }

  /* ── Orb scene ── */
  .bp-orb-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 22px;
  }
  .bp-orb-scene {
    position: relative; width: 420px; height: 420px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .bp-ring {
    position: absolute; top: 50%; left: 50%;
    border-radius: 50%;
    transform: translate(-50%,-50%);
    transition:
      width  4s ease-in-out, height 4s ease-in-out,
      opacity 4s ease-in-out, background 4s ease-in-out;
  }
  .bp-rp1 { animation: bp-rp1 3.8s ease-in-out infinite; }
  .bp-rp2 { animation: bp-rp2 4.2s ease-in-out infinite; }
  .bp-rp3 { animation: bp-rp3 3.5s ease-in-out infinite; }
  .bp-ro  { animation: bp-ro  5.0s ease-in-out infinite; }

  .bp-prog-svg {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    pointer-events: none; z-index: 5;
  }

  .bp-orb-center {
    position: absolute; z-index: 10;
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    display: flex; flex-direction: column;
    align-items: center; gap: 6px; pointer-events: none;
    width: 200px; text-align: center;
  }
  .bp-phase-lbl {
    font-family: 'Cormorant Garamond',serif; font-weight: 300;
    font-size: 1.2rem; letter-spacing: .42em; text-indent: .42em;
    text-transform: lowercase;
    transition: opacity .42s ease, color 4s ease;
  }
  .bp-phase-num {
    font-family: 'Jost',sans-serif; font-weight: 200;
    font-size: 1.8rem; letter-spacing: .04em;
    color: rgba(217,245,240,.3); min-height: 2.2rem;
  }

  /* ── Cycle dots ── */
  .bp-cycle-dots {
    display: flex; gap: 9px; align-items: center; justify-content: center;
  }
  .bp-cdot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(217,245,240,.18);
    border: 1px solid rgba(217,245,240,.1);
    transition: all .4s ease;
  }
  .bp-cdot.done {
    background: rgba(44,172,173,.62); border-color: rgba(44,172,173,.42);
    box-shadow: 0 0 9px rgba(44,172,173,.45);
  }
  .bp-cdot.current {
    background: #2CACAD; border-color: #75E2E0;
    box-shadow: 0 0 14px rgba(44,172,173,.75);
    transform: scale(1.4);
  }

  /* ── Responsive ── */
  @media (max-width: 500px) {
    .bp-orb-scene   { width: 300px; height: 300px; }
    .bp-prog-svg    { width: 278px; height: 278px; }
    .bp-nav         { padding: 12px 16px 10px; }
    .bp-back-btn    { padding: 6px 12px; font-size: .62rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .bp-blob, .bp-particle,
    .bp-rp1, .bp-rp2, .bp-rp3, .bp-ro { animation: none !important; }
    .bp-root * { transition-duration: .01ms !important; }
  }
`;

function injectCSS() {
  if (document.getElementById("serene-breathing-css")) return;
  const s = document.createElement("style");
  s.id = "serene-breathing-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const PHASES       = ["inhale", "pause", "exhale"]; // original — unchanged
const DURATION     = 4000;                           // original — unchanged
const TOTAL_CYCLES = 5;

/* Orb ring sizes & colors per phase — SERENE palette */
const RINGS = {
  inhale: [
    { w: 320, bg: "rgba(44,172,173,0.15)", blur: "10px" },
    { w: 236, bg: "rgba(44,172,173,0.24)", blur: "5px"  },
    { w: 148, bg: "rgba(44,172,173,0.38)", blur: "2px"  },
  ],
  pause: [
    { w: 320, bg: "rgba(117,226,224,0.13)", blur: "10px" },
    { w: 236, bg: "rgba(117,226,224,0.20)", blur: "5px"  },
    { w: 148, bg: "rgba(117,226,224,0.30)", blur: "2px"  },
  ],
  exhale: [
    { w: 236, bg: "rgba(2,77,96,0.32)",   blur: "10px" },
    { w: 170, bg: "rgba(2,77,96,0.44)",   blur: "5px"  },
    { w:  96, bg: "rgba(44,172,173,0.22)", blur: "2px"  },
  ],
};

const LABEL_COLOR = {
  inhale: "rgba(217,245,240,0.88)",
  pause:  "rgba(117,226,224,0.82)",
  exhale: "rgba(117,226,224,0.70)",
};

const ARC_COLOR = {
  inhale: "rgba(44,172,173,0.58)",
  pause:  "rgba(117,226,224,0.50)",
  exhale: "rgba(2,77,96,0.80)",
};

/* SVG progress ring — r=170 → circumference ≈ 1068 */
const ARC_R    = 170;
const ARC_CIRC = +(2 * Math.PI * ARC_R).toFixed(1); // 1068.1

const RING_TRANSITION =
  "width 4s ease-in-out, height 4s ease-in-out, opacity 4s ease-in-out, background 4s ease-in-out";

/* ═══════════════════════════════════════════════════════════════
   VOICE HELPERS — original logic, human-like tuning
═══════════════════════════════════════════════════════════════ */
function getVoice() {
  const voices = window.speechSynthesis.getVoices();
  const prefer  = ["samantha", "karen", "ava", "victoria", "moira", "zoe", "fiona", "lisa", "nicky"];
  return (
    voices.find(v => prefer.some(n => v.name.toLowerCase().includes(n))) ||
    voices.find(v => v.lang.startsWith("en-") && v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang === "en-US") ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0] || null
  );
}

function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u    = new SpeechSynthesisUtterance(text);
  u.rate     = 0.68;   // slower = calmer, more human
  u.pitch    = 1.08;   // slight warmth
  u.volume   = 0.95;
  const v    = getVoice();
  if (v) u.voice = v;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND — identical blob system used by chat & journal
═══════════════════════════════════════════════════════════════ */
function SereneBg() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id:   i,
    size: Math.random() * 5 + 2,
    left: `${Math.random() * 100}%`,
    dur:  `${13 + Math.random() * 12}s`,
    del:  `${Math.random() * 14}s`,
    op:   (Math.random() * 0.28 + 0.04).toFixed(2),
  }));

  return (
    <div className="bp-bg">
      <div className="bp-bg-base" />
      <div className="bp-blob bp-blob-1" />
      <div className="bp-blob bp-blob-2" />
      <div className="bp-blob bp-blob-3" />
      <div className="bp-blob bp-blob-4" />
      <div className="bp-noise" />
      {particles.map(p => (
        <span key={p.id} className="bp-particle" style={{
          width: p.size, height: p.size, left: p.left, bottom: -8,
          background: `rgba(44,172,173,${p.op})`,
          animationDuration: p.dur, animationDelay: p.del,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CYCLE DOTS
═══════════════════════════════════════════════════════════════ */
function CycleDots({ total, done, finished }) {
  return (
    <div className="bp-cycle-dots">
      {Array.from({ length: total }, (_, i) => {
        let cls = "bp-cdot";
        if (i < done)                   cls += " done";
        if (i === done && !finished)    cls += " current";
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function BreathingPage() {
  const navigate = useNavigate();

  /* ── Original state — unchanged ── */
  const [screen,      setScreen]      = useState("landing");
  const [exiting,     setExiting]     = useState(false);
  const [phaseIndex,  setPhaseIndex]  = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [isRunning,   setIsRunning]   = useState(false);

  /* ── UI state ── */
  const [cycleCount,  setCycleCount]  = useState(0);
  const [countdown,   setCountdown]   = useState(4);
  const [arcOffset,   setArcOffset]   = useState(ARC_CIRC);
  const [finished,    setFinished]    = useState(false);

  /* ── Original refs ── */
  const timerRef   = useRef(null);
  const runningRef = useRef(false);

  /* ── New refs ── */
  const countTimerRef = useRef(null);
  const arcFrameRef   = useRef(null);
  const arcStartRef   = useRef(null);
  const cycleRef      = useRef(0);

  const phase = PHASES[phaseIndex];

  /* ── stopAll — original extended with new timers ── */
  const stopAll = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    clearTimeout(timerRef.current);
    clearInterval(countTimerRef.current);
    cancelAnimationFrame(arcFrameRef.current);
    window.speechSynthesis.cancel();
  }, []);

  /* ── Arc animation ── */
  const startArc = useCallback(() => {
    cancelAnimationFrame(arcFrameRef.current);
    setArcOffset(ARC_CIRC);
    arcStartRef.current = null;
    function tick(ts) {
      if (!runningRef.current) return;
      if (!arcStartRef.current) arcStartRef.current = ts;
      const pct = Math.min((ts - arcStartRef.current) / DURATION, 1);
      setArcOffset(ARC_CIRC * (1 - pct));
      if (pct < 1) arcFrameRef.current = requestAnimationFrame(tick);
    }
    arcFrameRef.current = requestAnimationFrame(tick);
  }, []);

  /*
   * ── Countdown ──
   * Counts 4→3→2→1→0, purely visual. Voice is spoken separately
   * at the moment the phase begins (see scheduleNext & handleStart).
   */
  const startCountdown = useCallback(() => {
    clearInterval(countTimerRef.current);
    setCountdown(4);
    let n = 4;
    countTimerRef.current = setInterval(() => {
      if (!runningRef.current) { clearInterval(countTimerRef.current); return; }
      n--;
      if (n >= 0) setCountdown(n);
      if (n <= 0) clearInterval(countTimerRef.current);
    }, 1000);
  }, []);

  /* ── Finish session ── */
  const finishSession = useCallback(() => {
    stopAll();
    setFinished(true);
    speak("Well done. You did beautifully. Take a moment to breathe naturally.");
  }, [stopAll]);

  /* ── scheduleNext — original logic, voice speaks at phase start ── */
  const scheduleNext = useCallback((idx, cycle) => {
    if (!runningRef.current) return;

    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;

      // Fade out label
      setTextVisible(false);

      setTimeout(() => {
        if (!runningRef.current) return;

        const next     = (idx + 1) % PHASES.length;
        let nextCycle  = cycle;

        if (next === 0) {
          nextCycle         = cycle + 1;
          cycleRef.current  = nextCycle;
          setCycleCount(nextCycle);
        }

        // All cycles complete
        if (nextCycle >= TOTAL_CYCLES && next === 0) {
          finishSession();
          return;
        }

        setPhaseIndex(next);
        setTextVisible(true);

        // Speak the phase name immediately as the timer starts
        speak(PHASES[next] === "pause" ? "hold" : PHASES[next]);

        // Countdown runs visually alongside the phase
        startArc();
        startCountdown();

        scheduleNext(next, nextCycle);
      }, 440);
    }, DURATION);
  }, [startArc, startCountdown, finishSession]);

  /* ── handleStart — original ── */
  const handleStart = useCallback(() => {
    window.speechSynthesis.getVoices();
    setExiting(true);

    setTimeout(() => {
      setScreen("exercise");
      setPhaseIndex(0);
      setTextVisible(true);
      setFinished(false);
      setCycleCount(0);
      cycleRef.current  = 0;
      runningRef.current = true;
      setIsRunning(true);

      speak(
        "Welcome. Find a comfortable position, relax your shoulders, and gently close your eyes.",
        () => {
          if (!runningRef.current) return;
          // Speak "inhale" immediately as the first timer begins
          speak("inhale");
          startArc();
          startCountdown();
          scheduleNext(0, 0);
        }
      );
    }, 680);
  }, [scheduleNext, startArc, startCountdown]);

  /* ── handleStop — original ── */
  const handleStop = useCallback(() => stopAll(), [stopAll]);

  /* ── handleResume — original ── */
  const handleResume = useCallback(() => {
    runningRef.current = true;
    setIsRunning(true);
    setFinished(false);
    // Speak the current phase immediately when resuming
    speak(PHASES[phaseIndex] === "pause" ? "hold" : PHASES[phaseIndex]);
    startArc();
    startCountdown();
    scheduleNext(phaseIndex, cycleRef.current);
  }, [phaseIndex, scheduleNext, startArc, startCountdown]);

  /* ── handleRestart ── */
  const handleRestart = useCallback(() => {
    setPhaseIndex(0);
    setTextVisible(true);
    setFinished(false);
    setCycleCount(0);
    cycleRef.current   = 0;
    runningRef.current = true;
    setIsRunning(true);
    speak("inhale");
    startArc();
    startCountdown();
    scheduleNext(0, 0);
  }, [scheduleNext, startArc, startCountdown]);

  /* ── handleExit — original ── */
  const handleExit = useCallback(() => {
    stopAll();
    navigate(-1);
  }, [stopAll, navigate]);

  /* ── Cleanup on unmount — original ── */
  useEffect(() => () => stopAll(), [stopAll]);

  /* ── Inject styles ── */
  useEffect(() => { injectCSS(); }, []);

  /* ── Derived ── */
  const rings        = RINGS[phase];
  const labelColor   = LABEL_COLOR[phase];
  const arcColor     = ARC_COLOR[phase];
  const displayLabel = phase === "pause" ? "hold" : phase;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="bp-root">

      {/* SERENE background — same as chat & journal */}
      <SereneBg />

      {/* ── TOP NAV ── */}
      <nav className="bp-nav">
        <div>
          <div className="bp-nav-brand">SERENE</div>
          <div className="bp-nav-sub">Breathwork</div>
        </div>
        <div className="bp-nav-right">
          <button className="bp-back-btn" onClick={handleExit}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            SERENE's Home Page
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="bp-content">

        {/* ══════════ LANDING ══════════ */}
        <div className={`bp-screen bp-landing${screen === "landing" ? " active" : ""}${exiting ? " exiting" : ""}`}>
          <div className="bp-heading">
            <span className="bp-h-main">Breathing Sanctuary</span>
            <span className="bp-h-sub">stillness through breath</span>
          </div>

          <div className="bp-divider" />

          <p className="bp-desc">
            The 4-4-4 box breathing technique gently anchors your nervous system.
            Inhale for 4 seconds, hold for 4, exhale for 4. Each cycle brings
            you closer to stillness.
          </p>

          <div className="bp-guidelines">
            <span>Follow the guided voice and the glowing orb.</span>
            <span>Let your breath synchronise with each phase.</span>
            <span>There is nowhere else to be — just here, just now.</span>
          </div>

          <button className="bp-btn bp-btn-start" onClick={handleStart}>
            begin
          </button>
        </div>

        {/* ══════════ EXERCISE ══════════ */}
        <div className={`bp-screen${screen === "exercise" ? " active" : ""}`}>
          <div className="bp-orb-wrap">

            {/* ── ORB ── */}
            <div className="bp-orb-scene">

              {/* Outer ambient glow */}
              <div className="bp-ring bp-ro" style={{
                width: 460, height: 460,
                background: "radial-gradient(circle,rgba(44,172,173,.07) 0%,transparent 70%)",
                filter: "blur(18px)",
              }} />

              {/* 3 phase-driven rings */}
              {rings.map((r, i) => (
                <div key={i}
                  className={`bp-ring bp-rp${i + 1}`}
                  style={{
                    width:      r.w,
                    height:     r.w,
                    background: r.bg,
                    filter:     `blur(${r.blur})`,
                    transition: RING_TRANSITION,
                  }}
                />
              ))}

              {/* SVG progress arc */}
              <svg
                className="bp-prog-svg"
                width="360" height="360"
                viewBox="0 0 360 360"
              >
                {/* Track */}
                <circle cx="180" cy="180" r={ARC_R}
                  fill="none" stroke="rgba(217,245,240,0.07)" strokeWidth="1.5"
                />
                {/* Progress */}
                <circle cx="180" cy="180" r={ARC_R}
                  fill="none"
                  stroke={arcColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={ARC_CIRC}
                  strokeDashoffset={arcOffset}
                  transform="rotate(-90 180 180)"
                  style={{ transition: `stroke 1s ease` }}
                />
              </svg>

              {/* Phase label + countdown */}
              <div className="bp-orb-center">
                <span
                  className="bp-phase-lbl"
                  style={{
                    opacity: textVisible ? 1 : 0,
                    color:   finished ? "rgba(217,245,240,0.55)" : labelColor,
                  }}
                >
                  {finished ? "rest" : displayLabel}
                </span>
                {!finished && (
                  <span className="bp-phase-num">
                    {countdown > 0 ? countdown : ""}
                  </span>
                )}
                {finished && (
                  <span className="bp-phase-num" style={{ fontSize: "1.2rem" }}>✦</span>
                )}
              </div>
            </div>

            {/* Cycle dots */}
            <CycleDots
              total={TOTAL_CYCLES}
              done={cycleCount}
              finished={finished}
            />

            {/* Controls */}
            <div className="bp-controls">
              {finished ? (
                <button className="bp-btn" onClick={handleRestart}>again</button>
              ) : (
                <button className="bp-btn" onClick={isRunning ? handleStop : handleResume}>
                  {isRunning ? "stop" : "resume"}
                </button>
              )}
              <button className="bp-btn" onClick={handleExit}>← exit</button>
            </div>

          </div>
        </div>

      </div>{/* /bp-content */}
    </div>
  );
}