import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import LogoutModal from "../components/LogoutModal";
import { AuthContext } from "../context/AuthContext";

/* CSS */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  .ad-root *, .ad-root *::before, .ad-root *::after { box-sizing: border-box; }

  @keyframes ad-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(12%,-14%) scale(1.12)} 50%{transform:translate(-8%,16%) scale(.93)} 75%{transform:translate(6%,8%) scale(1.06)} }
  @keyframes ad-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 30%{transform:translate(-14%,10%) scale(1.15)} 60%{transform:translate(10%,-12%) scale(.9)} }
  @keyframes ad-blob3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(8%,14%) scale(1.08)} 80%{transform:translate(-6%,-8%) scale(.96)} }
  @keyframes ad-blob4 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-10%,-12%) scale(1.1)} 70%{transform:translate(12%,8%) scale(.92)} }
  @keyframes ad-particle { 0%{transform:translateY(0);opacity:.6} 100%{transform:translateY(-110vh);opacity:0} }
  @keyframes ad-fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ad-glow     { 0%,100%{text-shadow:0 0 40px rgba(44,172,173,.3),0 0 80px rgba(2,77,96,.15)} 50%{text-shadow:0 0 70px rgba(44,172,173,.55),0 0 130px rgba(2,77,96,.3)} }
  @keyframes ad-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.75)} }
  @keyframes ad-barFill  { from{width:0} to{width:var(--bar-w)} }
  @keyframes ad-countUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ad-spin     { to{transform:rotate(360deg)} }

  /* ── Background ── */
  .ad-bg          { position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none; }
  .ad-bg-base     { position:absolute;inset:0;background:radial-gradient(ellipse at 50% 110%,#1C4EA7 0%,#024D60 42%,#021F2E 100%); }
  .ad-blob        { position:absolute;border-radius:50%;will-change:transform; }
  .ad-blob-1      { width:min(80vw,780px);height:min(80vw,780px);top:-25%;left:-10%;background:radial-gradient(circle,rgba(44,172,173,.62) 0%,transparent 68%);filter:blur(72px);animation:ad-blob1 20s ease-in-out infinite; }
  .ad-blob-2      { width:min(70vw,680px);height:min(70vw,680px);top:15%;right:-18%;background:radial-gradient(circle,rgba(28,78,167,.58) 0%,transparent 66%);filter:blur(80px);animation:ad-blob2 26s ease-in-out infinite; }
  .ad-blob-3      { width:min(60vw,580px);height:min(60vw,580px);top:35%;left:22%;background:radial-gradient(circle,rgba(117,226,224,.28) 0%,transparent 62%);filter:blur(60px);animation:ad-blob3 17s ease-in-out infinite; }
  .ad-blob-4      { width:min(65vw,640px);height:min(65vw,640px);bottom:-20%;left:30%;background:radial-gradient(circle,rgba(2,77,96,.7) 0%,transparent 65%);filter:blur(90px);animation:ad-blob4 23s ease-in-out infinite; }
  .ad-noise       { position:absolute;inset:0;opacity:.04;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .ad-particle    { position:absolute;border-radius:50%;pointer-events:none;animation:ad-particle linear infinite; }

  /* ── Nav ── */
  .ad-nav         { position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:14px 36px;background:rgba(1,18,26,.38);border-bottom:1px solid rgba(217,245,240,.12);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px); }
  .ad-nav-brand   { font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:300;letter-spacing:.24em;color:#D9F5F0;animation:ad-glow 4s ease-in-out infinite; }
  .ad-nav-sub     { font-size:.64rem;letter-spacing:.32em;color:rgba(117,226,224,.75);text-transform:uppercase;font-weight:300;margin-top:2px;font-family:'Jost',sans-serif; }
  .ad-status-dot  { width:9px;height:9px;border-radius:50%;background:#2CACAD;box-shadow:0 0 10px rgba(44,172,173,.9),0 0 24px rgba(44,172,173,.4);animation:ad-pulse 2.4s ease-in-out infinite; }
  .ad-badge       { padding:5px 14px;border-radius:50px;background:rgba(44,172,173,.18);border:1px solid rgba(44,172,173,.38);font-size:.68rem;letter-spacing:.18em;color:#75E2E0;text-transform:uppercase;font-weight:400;font-family:'Jost',sans-serif; }
  .ad-logout      { display:flex;align-items:center;gap:7px;padding:8px 18px;border-radius:50px;background:rgba(217,245,240,.07);border:1px solid rgba(217,245,240,.18);color:rgba(217,245,240,.62);font-family:'Jost',sans-serif;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:all .22s ease; }
  .ad-logout:hover { background:rgba(220,80,80,.15);border-color:rgba(220,80,80,.35);color:rgba(255,150,150,.9); }

  /* ── Layout ── */
  .ad-main        { position:relative;z-index:1;padding:36px 36px 60px;max-width:1240px;margin:0 auto;width:100%; }

  /* ── Welcome ── */
  .ad-welcome     { margin-bottom:36px;animation:ad-fadeUp .6s ease both; }
  .ad-eyebrow     { font-size:.66rem;letter-spacing:.4em;color:rgba(117,226,224,.8);text-transform:uppercase;font-weight:300;margin-bottom:10px;font-family:'Jost',sans-serif; }
  .ad-title       { font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4.5vw,2.8rem);font-weight:300;color:#D9F5F0;letter-spacing:.06em;animation:ad-glow 4.5s ease-in-out infinite; }
  .ad-title span  { color:#75E2E0; }
  .ad-sub         { font-size:1.0rem;font-weight:300;letter-spacing:.06em;color:rgba(217,245,240,.55);margin-top:8px;font-family:'Jost',sans-serif; }

  /* ── Stat cards ── */
  .ad-stats-grid  { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px; }
  .ad-stat        { background:rgba(2,40,52,.65);border:1px solid rgba(217,245,240,.14);border-radius:20px;padding:22px 24px;backdrop-filter:blur(24px);transition:all .28s cubic-bezier(.34,1.2,.64,1);animation:ad-fadeUp .5s ease both;position:relative;overflow:hidden; }
  .ad-stat:hover  { transform:translateY(-3px);border-color:rgba(44,172,173,.32);box-shadow:0 16px 44px rgba(0,0,0,.32),0 0 32px rgba(44,172,173,.1); }
  .ad-stat-bar    { position:absolute;top:0;left:0;right:0;height:3px;border-radius:3px 3px 0 0;opacity:.85; }
  .ad-stat-icon   { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px; }
  .ad-stat-label  { font-size:.68rem;letter-spacing:.22em;color:rgba(217,245,240,.6);text-transform:uppercase;font-weight:300;margin-bottom:8px;font-family:'Jost',sans-serif; }
  .ad-stat-value  { font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:300;line-height:1;animation:ad-countUp .6s ease both; }
  .ad-stat-delta  { font-size:.72rem;color:rgba(117,226,224,.75);margin-top:6px;font-weight:300;font-family:'Jost',sans-serif; }

  /* ── Section labels ── */
  .ad-slabel      { font-size:.65rem;letter-spacing:.3em;color:rgba(117,226,224,.8);text-transform:uppercase;font-weight:300;margin-bottom:7px;font-family:'Jost',sans-serif; }
  .ad-stitle      { font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:300;color:#D9F5F0;letter-spacing:.05em;margin-bottom:20px; }

  /* ── Glass panel ── */
  .ad-panel       { background:rgba(2,40,52,.65);border:1px solid rgba(217,245,240,.14);border-radius:20px;padding:24px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);animation:ad-fadeUp .5s ease both; }

  /* ── Two-col grid ── */
  .ad-two-col     { display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px; }

  /* ── Mood chart ── */
  .ad-mood-row    { display:flex;flex-direction:column;gap:13px; }
  .ad-mood-item   { display:flex;align-items:center;gap:12px; }
  .ad-mood-name   { font-size:.8rem;font-weight:300;letter-spacing:.04em;color:rgba(217,245,240,.82);width:100px;flex-shrink:0;text-transform:capitalize;font-family:'Jost',sans-serif; }
  .ad-mood-track  { flex:1;height:7px;border-radius:4px;background:rgba(217,245,240,.1);overflow:hidden; }
  .ad-mood-fill   { height:100%;border-radius:4px;animation:ad-barFill .8s ease both; }
  .ad-mood-count  { font-size:.78rem;color:rgba(217,245,240,.7);width:32px;text-align:right;flex-shrink:0;font-family:'Jost',sans-serif;font-weight:400; }

  /* ── Activity feed ── */
  .ad-feed-item   { display:flex;align-items:flex-start;gap:13px;padding:13px 0;border-bottom:1px solid rgba(217,245,240,.08); }
  .ad-feed-item:last-child { border-bottom:none; }
  .ad-feed-icon   { width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .ad-feed-text   { font-size:.84rem;font-weight:300;color:rgba(217,245,240,.88);line-height:1.55;font-family:'Jost',sans-serif; }
  .ad-feed-name   { color:#75E2E0;font-weight:400; }
  .ad-feed-time   { font-size:.7rem;color:rgba(217,245,240,.48);margin-top:3px;font-family:'Jost',sans-serif; }

  /* ── User table ── */
  .ad-table-wrap  { background:rgba(2,40,52,.65);border:1px solid rgba(217,245,240,.14);border-radius:20px;padding:24px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);animation:ad-fadeUp .6s .1s ease both;overflow-x:auto; }
  .ad-table       { width:100%;border-collapse:collapse; }
  .ad-table th    { font-size:.66rem;letter-spacing:.22em;color:rgba(217,245,240,.55);text-transform:uppercase;font-weight:400;padding:0 16px 14px 0;text-align:left;border-bottom:1px solid rgba(217,245,240,.12);font-family:'Jost',sans-serif;white-space:nowrap; }
  .ad-table td    { padding:14px 16px 14px 0;border-bottom:1px solid rgba(217,245,240,.07);font-size:.86rem;font-weight:300;color:rgba(217,245,240,.85);vertical-align:middle;font-family:'Jost',sans-serif; }
  .ad-table tr:last-child td    { border-bottom:none; }
  .ad-table tbody tr:hover td   { color:#D9F5F0;background:rgba(44,172,173,.05); }
  .ad-avatar      { width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#2CACAD,#1C4EA7);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:500;color:#D9F5F0;flex-shrink:0;border:1px solid rgba(44,172,173,.3); }
  .ad-user-cell   { display:flex;align-items:center;gap:12px; }
  .ad-chip        { display:inline-flex;align-items:center;padding:4px 11px;border-radius:50px;font-size:.7rem;letter-spacing:.08em;text-transform:capitalize;font-weight:400;font-family:'Jost',sans-serif; }
  .ad-email       { font-size:.78rem;color:rgba(217,245,240,.62);font-family:'Jost',sans-serif; }
  .ad-joined      { font-size:.78rem;color:rgba(217,245,240,.62);font-family:'Jost',sans-serif; }
  .ad-num         { font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:#D9F5F0; }

  /* ── Spinner ── */
  .ad-spinner     { width:36px;height:36px;border:2px solid rgba(44,172,173,.22);border-top-color:rgba(44,172,173,.75);border-radius:50%;animation:ad-spin .8s linear infinite;margin:80px auto; }

  /* ── Responsive ── */
  @media(max-width:960px) { .ad-stats-grid{grid-template-columns:repeat(2,1fr)} .ad-two-col{grid-template-columns:1fr} }
  @media(max-width:540px) { .ad-stats-grid{grid-template-columns:1fr} .ad-nav{padding:12px 16px} .ad-main{padding:22px 14px 52px} }
  @media(prefers-reduced-motion:reduce) {
    .ad-blob,.ad-particle{animation:none!important}
    .ad-root *{transition-duration:.01ms!important;animation-duration:.01ms!important}
  }
`;

function injectCSS() {
  if (document.getElementById("serene-admin-css")) return;
  const s = document.createElement("style");
  s.id = "serene-admin-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const VALID_MOODS = new Set([
  "happy","sad","angry","anxious","excited",
  "tired","neutral","grateful","lonely","overwhelmed"
]);

const MOOD_COLORS = {
  happy:"#FFD166", sad:"#6B8CAE", angry:"#EF6C6C", anxious:"#B39DDB",
  excited:"#FF8C42", tired:"#90A4AE", neutral:"#78909C",
  grateful:"#66BB6A", lonely:"#4FC3F7", overwhelmed:"#CE93D8",
};

const MOOD_EMOJI = {
  happy:"😊", sad:"😢", angry:"😠", anxious:"😰", excited:"🤩",
  tired:"😴", neutral:"😐", grateful:"🙏", lonely:"🌧️", overwhelmed:"🌀",
};

/* SVG icons replace emoji for crisp rendering */
const STAT_CONFIG = [
  {
    key:"users", label:"Total Users", color:"rgba(44,172,173,1)", soft:"rgba(44,172,173,.16)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(44,172,173,0.9)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    key:"conversations", label:"Chat Sessions", color:"rgba(117,226,224,1)", soft:"rgba(117,226,224,.14)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(117,226,224,0.9)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
  {
    key:"journals", label:"Journal Entries", color:"rgba(150,185,255,1)", soft:"rgba(150,185,255,.14)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(150,185,255,0.9)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    key:"messages", label:"Total Messages", color:"rgba(44,172,173,1)", soft:"rgba(2,77,96,.22)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(44,172,173,0.9)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  },
];

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════════ */
function AdminBg() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: `${Math.random() * 100}%`,
    dur:  `${13 + Math.random() * 12}s`,
    del:  `${Math.random() * 14}s`,
    op:   (Math.random() * 0.28 + 0.04).toFixed(2),
  }));

  return (
    <div className="ad-bg">
      <div className="ad-bg-base"/>
      <div className="ad-blob ad-blob-1"/>
      <div className="ad-blob ad-blob-2"/>
      <div className="ad-blob ad-blob-3"/>
      <div className="ad-blob ad-blob-4"/>
      <div className="ad-noise"/>
      {particles.map(p => (
        <span key={p.id} className="ad-particle" style={{
          width: p.size, height: p.size, left: p.left, bottom: -8,
          background: `rgba(44,172,173,${p.op})`,
          animationDuration: p.dur, animationDelay: p.del,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════ */
function StatCard({ cfg, value, index }) {
  return (
    <div className="ad-stat" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="ad-stat-bar" style={{ background: cfg.color }}/>
      <div className="ad-stat-icon" style={{ background: cfg.soft }}>
        {cfg.icon}
      </div>
      <div className="ad-stat-label">{cfg.label}</div>
      <div className="ad-stat-value" style={{ color: cfg.color, animationDelay: `${0.2 + index * 0.08}s` }}>
        {value ?? "—"}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOOD CHART
═══════════════════════════════════════════════════════════════ */
function MoodChart({ moodStats }) {
  // Filter to valid moods only, sort by count desc
  const entries = Object.entries(moodStats)
    .filter(([mood]) => VALID_MOODS.has(mood))
    .sort((a, b) => b[1] - a[1]);

  const max = entries[0]?.[1] || 1;

  return (
    <div className="ad-panel" style={{ animationDelay: "0.1s" }}>
      <p className="ad-slabel">Emotional Landscape</p>
      <p className="ad-stitle">Mood Distribution</p>
      <div className="ad-mood-row">
        {entries.map(([mood, count], i) => {
          const pct = Math.round((count / max) * 100);
          const color = MOOD_COLORS[mood] || "#78909C";
          return (
            <div key={mood} className="ad-mood-item">
              <span className="ad-mood-name">
                {MOOD_EMOJI[mood] || "•"} {mood}
              </span>
              <div className="ad-mood-track">
                <div
                  className="ad-mood-fill"
                  style={{
                    "--bar-w": `${pct}%`,
                    width: `${pct}%`,
                    background: color,
                    animationDelay: `${0.3 + i * 0.06}s`,
                  }}
                />
              </div>
              <span className="ad-mood-count">{count}</span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p style={{ color: "rgba(217,245,240,.5)", fontSize: ".85rem", fontFamily: "'Jost',sans-serif" }}>
            No journal data yet.
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTIVITY FEED
═══════════════════════════════════════════════════════════════ */
function ActivityFeed({ activity }) {
  const formatTime = (iso) => {
    if (!iso) return "";
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1)  return "just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24)  return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch { return ""; }
  };

  const ChatIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="rgba(44,172,173,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );

  const JournalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="rgba(117,226,224,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );

  return (
    <div className="ad-panel" style={{ animationDelay: "0.15s" }}>
      <p className="ad-slabel">Live Feed</p>
      <p className="ad-stitle">Recent Activity</p>
      <div>
        {activity.slice(0, 8).map((item, i) => {
          const isChat = item.type === "chat";
          return (
            <div key={i} className="ad-feed-item">
              <div className="ad-feed-icon" style={{
                background: isChat ? "rgba(44,172,173,0.14)" : "rgba(117,226,224,0.12)",
              }}>
                {isChat ? <ChatIcon/> : <JournalIcon/>}
              </div>
              <div>
                <div className="ad-feed-text">
                  <span className="ad-feed-name">{item.user_name}</span>
                  {" "}
                  {isChat ? "started a conversation" : "wrote a journal entry"}
                  {item.mood && VALID_MOODS.has(item.mood)
                    ? ` (${item.mood})`
                    : ""}
                </div>
                <div className="ad-feed-time">{formatTime(item.created_at)}</div>
              </div>
            </div>
          );
        })}
        {activity.length === 0 && (
          <p style={{ color: "rgba(217,245,240,.5)", fontSize: ".85rem", fontFamily: "'Jost',sans-serif" }}>
            No recent activity.
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   USER TABLE
═══════════════════════════════════════════════════════════════ */
function UserTable({ users }) {
  const initials = (name) =>
    (name || "?").split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() || "?").join("");

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch { return "—"; }
  };

  return (
    <div className="ad-table-wrap">
      <p className="ad-slabel">Community</p>
      <p className="ad-stitle">Registered Users</p>
      <table className="ad-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Chats</th>
            <th>Journals</th>
            <th>Latest Mood</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const mood      = u.latest_mood && VALID_MOODS.has(u.latest_mood) ? u.latest_mood : null;
            const moodColor = mood ? (MOOD_COLORS[mood] || "#78909C") : null;

            return (
              <tr key={u.id || i} style={{ animation: `ad-fadeUp .4s ease ${i * 0.04}s both` }}>

                {/* User name + avatar */}
                <td>
                  <div className="ad-user-cell">
                    <div className="ad-avatar">{initials(u.name)}</div>
                    <span style={{ fontWeight: 400, color: "#D9F5F0", fontSize: ".88rem" }}>
                      {u.name || "—"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td>
                  <span className="ad-email">{u.email || "—"}</span>
                </td>

                {/* Chats */}
                <td>
                  <span className="ad-num">{u.chat_count ?? 0}</span>
                </td>

                {/* Journals */}
                <td>
                  <span className="ad-num">{u.journal_count ?? 0}</span>
                </td>

                {/* Mood */}
                <td>
                  {mood ? (
                    <span
                      className="ad-chip"
                      style={{
                        background: moodColor + "26",
                        color:      moodColor,
                        border:     `1px solid ${moodColor}55`,
                      }}
                    >
                      {MOOD_EMOJI[mood]} {mood}
                    </span>
                  ) : (
                    <span style={{ color: "rgba(217,245,240,.38)", fontSize: ".78rem" }}>—</span>
                  )}
                </td>

                {/* Joined */}
                <td>
                  <span className="ad-joined">{formatDate(u.created_at)}</span>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td colSpan={6} style={{
                textAlign: "center", padding: "48px 0",
                color: "rgba(217,245,240,.4)",
                fontStyle: "italic", fontSize: ".88rem",
                fontFamily: "'Cormorant Garamond',serif",
              }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("Admin");
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [moodStats, setMoodStats] = useState({});
  const [activity,  setActivity]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    injectCSS();
    const email = localStorage.getItem("userEmail");
    const name  = localStorage.getItem(`username_${email}`);
    if (name) setAdminName(name);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, moodRes, activityRes] = await Promise.all([
        API.get("/api/admin/stats"),
        API.get("/api/admin/users"),
        API.get("/api/admin/mood-stats"),
        API.get("/api/admin/activity"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMoodStats(moodRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      if (err?.response?.status === 403) {
        navigate("/login");
      } else {
        setError("Could not load admin data. Please try again.");
        console.error(err);
      }
    }
    setLoading(false);
  };

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
  setShowLogoutModal(true);
};

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="ad-root"
      style={{
        position: "relative", minHeight: "100vh",
        background: "#021F2E", color: "#D9F5F0",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <AdminBg />

      {/* ── NAV ── */}
      <nav className="ad-nav">
        <div>
          <div className="ad-nav-brand">SERENE</div>
          <div className="ad-nav-sub">Admin Console</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="ad-status-dot"/>
          <div className="ad-badge">Admin</div>
          <button className="ad-logout" onClick={handleLogout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="ad-main">

        {/* Welcome */}
        <div className="ad-welcome">
          <p className="ad-eyebrow">Admin Overview</p>
          <h1 className="ad-title">
            {timeGreeting}, <span>{adminName}</span> ✦
          </h1>
          <p className="ad-sub">Here's how SERENE's community is doing right now.</p>
        </div>

        {loading ? (
          <div className="ad-spinner"/>
        ) : error ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "rgba(217,245,240,.55)",
            fontFamily: "'Jost',sans-serif", fontSize: ".9rem", letterSpacing: ".06em",
          }}>
            {error}
            <br/>
            <button
              onClick={loadAll}
              style={{
                marginTop: 18, padding: "9px 22px", borderRadius: 50,
                background: "rgba(44,172,173,.16)", border: "1px solid rgba(44,172,173,.35)",
                color: "#75E2E0", cursor: "pointer",
                fontFamily: "'Jost',sans-serif", fontSize: ".74rem",
                letterSpacing: ".14em", textTransform: "uppercase",
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="ad-stats-grid">
              {STAT_CONFIG.map((cfg, i) => (
                <StatCard key={cfg.key} cfg={cfg} value={stats?.[cfg.key]} index={i}/>
              ))}
            </div>

            {/* Mood + Activity */}
            <div className="ad-two-col">
              <MoodChart moodStats={moodStats}/>
              <ActivityFeed activity={activity}/>
            </div>

            {/* User table */}
            <UserTable users={users}/>
          </>
        )}
      </div>
      {showLogoutModal && (
  <LogoutModal
    onCancel={() => setShowLogoutModal(false)}
    onConfirm={() => {
      setShowLogoutModal(false);
      logout();
      navigate("/");
    }}
  />
)}
    </div>
  );
}