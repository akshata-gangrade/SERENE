export function injectJournalStyles() {
  if (document.getElementById("serene-journal-css")) return;
  const s = document.createElement("style");
  s.id = "serene-journal-css";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Caveat:wght@400;500;600&family=Jost:wght@200;300;400&display=swap');

    .sj-root *, .sj-root *::before, .sj-root *::after { box-sizing: border-box; }

    /* ── Animations ── */
    @keyframes sj-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(8%,-10%) scale(1.08)} 66%{transform:translate(-6%,12%) scale(.94)} }
    @keyframes sj-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-10%,8%) scale(1.12)} 70%{transform:translate(9%,-9%) scale(.92)} }
    @keyframes sj-blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(5%,10%) scale(1.06)} }
    @keyframes sj-pt    { 0%{transform:translateY(0);opacity:.5} 100%{transform:translateY(-110vh);opacity:0} }
    @keyframes sj-fadeUp{ from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sj-glow  { 0%,100%{text-shadow:0 0 40px rgba(44,172,173,.3),0 0 80px rgba(2,77,96,.14)} 50%{text-shadow:0 0 70px rgba(44,172,173,.55),0 0 120px rgba(2,77,96,.28)} }
    @keyframes sj-modalIn { from{opacity:0;transform:scale(.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes sj-lineGrow { from{width:0;opacity:0} to{width:100%;opacity:1} }

    /* ── Panel scroll ── */
    .sj-panel {
      height: 100%;
      overflow-y: auto;
      padding: 28px 32px 40px;
      scrollbar-width: thin;
      scrollbar-color: rgba(44,172,173,0.2) transparent;
      animation: sj-fadeUp .42s ease both;
    }
    .sj-panel::-webkit-scrollbar { width: 3px; }
    .sj-panel::-webkit-scrollbar-thumb { background: rgba(44,172,173,.2); border-radius: 4px; }

    /* ── Back button ── */
    .sj-back-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 7px 16px; border-radius: 50px;
      background: rgba(44,172,173,.1);
      border: 1px solid rgba(44,172,173,.22);
      color: rgba(217,245,240,.65);
      font-size: .68rem; letter-spacing: .16em; text-transform: uppercase;
      cursor: pointer; font-family: 'Jost',sans-serif; font-weight: 300;
      transition: all .22s ease;
    }
    .sj-back-btn:hover { background: rgba(44,172,173,.2); color: #D9F5F0; }

    /* ── Tabs ── */
    .sj-tab {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 22px;
      font-family: 'Jost',sans-serif; font-size: .7rem; font-weight: 300;
      letter-spacing: .18em; text-transform: uppercase;
      color: rgba(217,245,240,.35);
      cursor: pointer; border: none; background: none;
      border-bottom: 2px solid transparent;
      transition: all .25s ease;
      position: relative; top: 1px;
    }
    .sj-tab.active { color: #75E2E0; border-bottom-color: #2CACAD; }
    .sj-tab:hover:not(.active) { color: rgba(217,245,240,.62); }

    /* ── Glass input ── */
    .sj-input {
      width: 100%;
      background: rgba(217,245,240,.05);
      border: 1px solid rgba(217,245,240,.14);
      border-radius: 12px; padding: 11px 15px;
      color: #D9F5F0; font-family: 'Jost',sans-serif;
      font-size: .88rem; font-weight: 300; letter-spacing: .04em;
      outline: none;
      transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
      backdrop-filter: blur(8px);
    }
    .sj-input::placeholder { color: rgba(217,245,240,.22); }
    .sj-input:focus {
      border-color: rgba(44,172,173,.55);
      box-shadow: 0 0 0 3px rgba(44,172,173,.12), 0 2px 12px rgba(44,172,173,.1);
      background: rgba(217,245,240,.08);
    }
    .sj-input option { background: #021F2E; color: #D9F5F0; }

    /* ── Handwriting textarea ── */
    .sj-textarea {
      width: 100%; min-height: 220px;
      background: rgba(10,30,40,.62);
      border: 1px solid rgba(217,245,240,.14);
      border-radius: 16px; padding: 20px 22px;
      color: rgba(217,245,240,.9);
      font-family: 'Caveat', cursive;
      font-size: 1.22rem; line-height: 1.92; letter-spacing: .02em;
      outline: none; resize: vertical;
      transition: border-color .25s ease, box-shadow .25s ease;
      backdrop-filter: blur(12px);
      /* ruled lines */
      background-image: repeating-linear-gradient(
        transparent,
        transparent calc(1.92em * 1.22 - 1px),
        rgba(44,172,173,.07) calc(1.92em * 1.22 - 1px),
        rgba(44,172,173,.07) calc(1.92em * 1.22)
      );
      background-size: 100% calc(1.92em * 1.22);
    }
    .sj-textarea::placeholder { color: rgba(217,245,240,.18); font-family: 'Caveat',cursive; font-size: 1.15rem; }
    .sj-textarea:focus { border-color: rgba(44,172,173,.45); box-shadow: 0 0 0 3px rgba(44,172,173,.1); }

    /* ── Mood chip ── */
    .sj-chip {
      padding: 6px 13px; border-radius: 50px;
      font-family: 'Jost',sans-serif; font-size: .68rem; font-weight: 300;
      letter-spacing: .1em; cursor: pointer;
      border: 1px solid rgba(217,245,240,.14);
      background: rgba(217,245,240,.05); color: rgba(217,245,240,.48);
      transition: all .2s ease; text-transform: capitalize;
    }
    .sj-chip.selected { font-weight: 400; box-shadow: 0 2px 14px rgba(0,0,0,.22); color: #021F2E !important; }
    .sj-chip:hover:not(.selected) { background: rgba(217,245,240,.1); color: rgba(217,245,240,.82); }

    /* ── Submit button ── */
    .sj-submit {
      width: 100%; padding: 13px; border-radius: 50px; border: none; cursor: pointer;
      background: linear-gradient(135deg,#2CACAD 0%,#024D60 100%);
      color: #D9F5F0; font-family: 'Jost',sans-serif; font-size: .74rem;
      font-weight: 300; letter-spacing: .22em; text-transform: uppercase;
      box-shadow: 0 6px 28px rgba(44,172,173,.32);
      transition: all .28s cubic-bezier(.34,1.56,.64,1); margin-top: 18px;
    }
    .sj-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(44,172,173,.5); }
    .sj-submit:active { transform: scale(.98); }
    .sj-submit:disabled { opacity: .5; cursor: default; }

    /* ── Journal card ── */
    .sj-jcard {
      background: rgba(2,36,48,.55);
      border: 1px solid rgba(217,245,240,.1);
      border-radius: 18px; padding: 20px;
      backdrop-filter: blur(20px);
      transition: all .28s cubic-bezier(.34,1.2,.64,1);
      animation: sj-fadeUp .45s ease both;
      cursor: default;
    }
    .sj-jcard:hover {
      transform: translateY(-3px);
      border-color: rgba(44,172,173,.22);
      box-shadow: 0 14px 40px rgba(0,0,0,.28), 0 0 28px rgba(44,172,173,.08);
    }

    /* ── Calendar day ── */
    .sj-cal-day {
      aspect-ratio: 1; border-radius: 10px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: rgba(217,245,240,.04);
      border: 1px solid rgba(217,245,240,.07);
      font-family: 'Jost',sans-serif; font-size: .8rem; font-weight: 300;
      color: rgba(217,245,240,.45);
      transition: all .2s ease; position: relative;
    }
    .sj-cal-day.has-entry { color: #D9F5F0; cursor: pointer; }
    .sj-cal-day.has-entry:hover { transform: scale(1.08); box-shadow: 0 4px 20px rgba(0,0,0,.3); }
    .sj-cal-day.today { border-color: rgba(44,172,173,.5) !important; color: #75E2E0; }
    .sj-cal-day.empty { opacity: 0; pointer-events: none; }

    /* ── Modal backdrop ── */
    .sj-modal-backdrop {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(2,10,18,.78);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: sj-fadeUp .28s ease both;
    }
    .sj-modal-card {
      width: 100%; max-width: 560px;
      background: rgba(2,40,52,.88);
      border: 1px solid rgba(217,245,240,.14);
      border-radius: 24px;
      backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
      box-shadow: 0 32px 80px rgba(0,0,0,.5);
      padding: 32px; position: relative;
      animation: sj-modalIn .35s ease both;
      max-height: 85vh; overflow-y: auto;
    }

    /* ── AI prompt box ── */
    .sj-ai-prompt {
      background: rgba(44,172,173,.07);
      border: 1px solid rgba(44,172,173,.2);
      border-radius: 14px; padding: 14px 18px;
      display: flex; align-items: flex-start; gap: 12px;
    }
    .sj-ai-icon {
      width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%;
      background: linear-gradient(135deg,#2CACAD,#024D60);
      display: flex; align-items: center; justify-content: center; margin-top: 1px;
    }
    .sj-prompt-text {
      font-family: 'Cormorant Garamond',serif; font-style: italic;
      font-size: 1.05rem; font-weight: 300; color: rgba(217,245,240,.7);
      line-height: 1.55; letter-spacing: .02em;
      transition: opacity .35s ease;
    }

    /* ── Form labels ── */
    .sj-label {
      font-size: .58rem; letter-spacing: .28em; text-transform: uppercase;
      color: rgba(44,172,173,.6); font-weight: 300; font-family: 'Jost',sans-serif;
      margin-bottom: 6px; display: block;
    }

    /* ── Section header ── */
    .sj-eyebrow {
      font-size: .58rem; letter-spacing: .38em; color: rgba(44,172,173,.55);
      text-transform: uppercase; font-weight: 300; margin-bottom: 7px;
      font-family: 'Jost',sans-serif;
    }
    .sj-section-title {
      font-family: 'Cormorant Garamond',serif; font-size: 1.5rem;
      font-weight: 300; color: #D9F5F0; letter-spacing: .06em; margin-bottom: 20px;
    }

    /* ── Responsive ── */
    @media (max-width: 700px) {
      .sj-panel { padding: 20px 16px 32px; }
      .sj-tab { padding: 12px 14px; font-size: .62rem; }
      .sj-back-btn { padding: 6px 12px; font-size: .62rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .sj-root * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Shared animated background ── */
export function SereneBg() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    dur: `${11 + Math.random() * 10}s`,
    del: `${Math.random() * 11}s`,
    op: (Math.random() * 0.2 + 0.04).toFixed(2),
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%,#1C4EA7 0%,#024D60 38%,#021F2E 100%)" }}/>
      <div style={{ position:"absolute",top:"-22%",left:"-10%",width:"min(70vw,680px)",height:"min(70vw,680px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(44,172,173,.5) 0%,transparent 68%)",filter:"blur(68px)",animation:"sj-blob1 22s ease-in-out infinite",willChange:"transform" }}/>
      <div style={{ position:"absolute",top:"18%",right:"-14%",width:"min(60vw,600px)",height:"min(60vw,600px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(28,78,167,.48) 0%,transparent 65%)",filter:"blur(76px)",animation:"sj-blob2 28s ease-in-out infinite",willChange:"transform" }}/>
      <div style={{ position:"absolute",bottom:"-18%",left:"28%",width:"min(55vw,540px)",height:"min(55vw,540px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(2,77,96,.6) 0%,transparent 64%)",filter:"blur(84px)",animation:"sj-blob3 18s ease-in-out infinite",willChange:"transform" }}/>
      <div style={{ position:"absolute",inset:0,opacity:.03,mixBlendMode:"overlay",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}/>
      {particles.map(p => (
        <span key={p.id} style={{ position:"absolute",borderRadius:"50%",width:p.size,height:p.size,left:p.left,bottom:-6,background:`rgba(44,172,173,${p.op})`,animation:`sj-pt ${p.dur} linear ${p.del} infinite` }}/>
      ))}
    </div>
  );
}