/* SERENE — Shared Style Utilities */

import { useMemo } from "react";

export const COLORS = {
  prussian: "#1C4EA7",
  midnight: "#024D60",
  teal: "#2CACAD",
  skyBlue: "#75E2E0",
  water: "#D9F5F0",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');
`;

export const GLOBAL_CSS = `
${FONTS}

/* ───────────────── RESET ───────────────── */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* ───────────────── ANIMATIONS ───────────────── */

@keyframes blob1 {
  0%   { transform: translate(0%,0%) scale(1); }
  25%  { transform: translate(12%,-14%) scale(1.12); }
  50%  { transform: translate(-8%,16%) scale(0.93); }
  75%  { transform: translate(6%,8%) scale(1.06); }
  100% { transform: translate(0%,0%) scale(1); }
}

@keyframes blob2 {
  0%   { transform: translate(0%,0%) scale(1); }
  30%  { transform: translate(-14%,10%) scale(1.15); }
  60%  { transform: translate(10%,-12%) scale(0.9); }
  100% { transform: translate(0%,0%) scale(1); }
}

@keyframes blob3 {
  0%   { transform: translate(0%,0%) scale(1); }
  40%  { transform: translate(8%,14%) scale(1.08); }
  80%  { transform: translate(-6%,-8%) scale(0.96); }
  100% { transform: translate(0%,0%) scale(1); }
}

@keyframes blob4 {
  0%   { transform: translate(0%,0%) scale(1); }
  35%  { transform: translate(-10%,-12%) scale(1.1); }
  70%  { transform: translate(12%,8%) scale(0.92); }
  100% { transform: translate(0%,0%) scale(1); }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes lineGrow {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 56px;
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0%,100% {
    text-shadow:
      0 0 40px rgba(44,172,173,0.3),
      0 0 80px rgba(2,77,96,0.15);
  }

  50% {
    text-shadow:
      0 0 70px rgba(44,172,173,0.55),
      0 0 130px rgba(2,77,96,0.3);
  }
}

@keyframes particleRise {
  0% {
    transform: translateY(0);
    opacity: 0.6;
  }

  100% {
    transform: translateY(-110vh);
    opacity: 0;
  }
}

@keyframes dotPulse {
  0%,100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.75);
  }
}

@keyframes typingDot {
  0%,80%,100% {
    transform: scale(0.6);
    opacity: 0.3;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes sidebarItemIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ───────────────── SCROLLBAR ───────────────── */

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(44,172,173,0.25);
  border-radius: 10px;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(44,172,173,0.25) transparent;
}

/* ───────────────── BUTTONS ───────────────── */

.s-btn {
  position: relative;
  border: none;
  cursor: pointer;
  overflow: hidden;

  font-family: 'Jost', sans-serif;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  border-radius: 999px;

  transition:
    transform 0.22s cubic-bezier(.34,1.56,.64,1),
    box-shadow 0.22s ease,
    background 0.28s ease,
    opacity 0.22s ease;
}

.s-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;

  background: rgba(255,255,255,0);

  transition: background 0.22s ease;
}

.s-btn:hover {
  transform: translateY(-3px) scale(1.04);
}

.s-btn:hover::after {
  background: rgba(255,255,255,0.06);
}

.s-btn:active {
  transform: translateY(0) scale(0.97);
}

.s-btn-primary {
  background: linear-gradient(
    135deg,
    #2CACAD 0%,
    #024D60 100%
  );

  color: #D9F5F0;

  box-shadow:
    0 4px 24px rgba(44,172,173,0.35),
    0 1px 4px rgba(0,0,0,0.2);
}

.s-btn-primary:hover {
  box-shadow:
    0 8px 34px rgba(44,172,173,0.5),
    0 2px 8px rgba(0,0,0,0.25);
}

/* ───────────────── INPUTS ───────────────── */

.s-input {
  width: 100%;

  padding: 14px 18px;

  border-radius: 14px;
  border: 1px solid rgba(217,245,240,0.18);

  background: rgba(217,245,240,0.06);

  color: #D9F5F0;

  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  font-weight: 300;
  letter-spacing: 0.04em;

  outline: none;

  backdrop-filter: blur(10px);

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.s-input::placeholder {
  color: rgba(217,245,240,0.35);
}

.s-input:focus {
  border-color: rgba(44,172,173,0.65);

  background: rgba(217,245,240,0.1);

  box-shadow:
    0 0 0 3px rgba(44,172,173,0.16),
    0 2px 12px rgba(44,172,173,0.12);
}

/* ───────────────── GLASS CARD ───────────────── */

.s-glass {
  background: rgba(2,47,60,0.42);

  border: 1px solid rgba(217,245,240,0.12);

  border-radius: 24px;

  backdrop-filter: blur(18px) saturate(1.3);
  -webkit-backdrop-filter: blur(18px) saturate(1.3);

  box-shadow:
    0 20px 60px rgba(0,0,0,0.32),
    0 1px 0 rgba(217,245,240,0.06) inset;
}

/* ───────────────── PARTICLES ───────────────── */

.s-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  animation: particleRise linear infinite;
}

/* ───────────────── TYPING INDICATOR ───────────────── */

.typing-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: rgba(117,226,224,0.7);

  display: inline-block;

  animation: typingDot 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.16s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.32s;
}
`;

/* ───────────────── GLOBAL STYLE INJECTOR ───────────────── */

export function injectGlobalStyles() {
  if (document.getElementById("serene-global")) return;

  const style = document.createElement("style");

  style.id = "serene-global";
  style.textContent = GLOBAL_CSS;

  document.head.appendChild(style);
}

/* ───────────────── BACKGROUND ───────────────── */

export function SereneBg() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.random() * 5 + 2,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 14}s`,
        duration: `${13 + Math.random() * 12}s`,
        opacity: (Math.random() * 0.24 + 0.04).toFixed(2),
      })),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Base Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 110%, #1C4EA7 0%, #024D60 42%, #021F2E 100%)",
        }}
      />

      {/* Blob A */}
      <div
        style={{
          position: "absolute",
          top: "-25%",
          left: "-10%",
          width: "min(80vw,780px)",
          height: "min(80vw,780px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(44,172,173,0.6) 0%, transparent 68%)",
          filter: "blur(58px)",
          animation: "blob1 20s ease-in-out infinite",
        }}
      />

      {/* Blob B */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "-18%",
          width: "min(70vw,680px)",
          height: "min(70vw,680px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(28,78,167,0.55) 0%, transparent 66%)",
          filter: "blur(60px)",
          animation: "blob2 26s ease-in-out infinite",
        }}
      />

      {/* Blob C */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "22%",
          width: "min(60vw,580px)",
          height: "min(60vw,580px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(117,226,224,0.25) 0%, transparent 62%)",
          filter: "blur(50px)",
          animation: "blob3 17s ease-in-out infinite",
        }}
      />

      {/* Blob D */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "30%",
          width: "min(65vw,640px)",
          height: "min(65vw,640px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(2,77,96,0.68) 0%, transparent 65%)",
          filter: "blur(65px)",
          animation: "blob4 23s ease-in-out infinite",
        }}
      />

      {/* Noise Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="s-particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: "-8px",
            background: `rgba(44,172,173,${p.opacity})`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ───────────────── TYPING INDICATOR ───────────────── */

export function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        padding: "4px 2px",
      }}
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

/* ───────────────── STATUS DOT ───────────────── */

export function StatusDot() {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#2CACAD",

        boxShadow:
          "0 0 10px rgba(44,172,173,0.9), 0 0 24px rgba(44,172,173,0.4)",

        animation: "dotPulse 2.4s ease-in-out infinite",
      }}
    />
  );
}