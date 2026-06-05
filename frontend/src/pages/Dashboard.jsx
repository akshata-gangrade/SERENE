import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import NameModal from "../components/NameModal";
import chatbot   from "../assets/chatbot.png";
import journal   from "../assets/journal.png";
import breathing from "../assets/breathing.png";
import { AuthContext } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";

/* ─────────────────────────────────────────────
   DATA — 
───────────────────────────────────────────── */
const CARDS = [
  {
    id: "chat",
    route: "/chat",
    label: "AI Companion",
    tag: "Chatbot",
    image: chatbot,
    accent: "rgba(44,172,173,1)",
    accentSoft: "rgba(44,172,173,0.18)",
    accentGlow: "rgba(44,172,173,0.35)",
    description:
      "Talk to your personal AI companion anytime. Share how you're feeling, work through your thoughts, and receive compassionate, non-judgmental support.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: "journal",
    route: "/journal",
    label: "Mindful Journal",
    tag: "Journal",
    image: journal,
    accent: "rgba(117,226,224,1)",
    accentSoft: "rgba(117,226,224,0.15)",
    accentGlow: "rgba(117,226,224,0.3)",
    description:
      "Express yourself freely in a private, beautiful journal. Write, reflect, and track your emotional journey over time — your thoughts are safe and only yours.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    id: "breathing",
    route: "/breathing",
    label: "Breathwork",
    tag: "Breathing",
    image: breathing,
    accent: "rgb(23,187,224)",
    accentSoft: "rgba(28,78,167,0.2)",
    accentGlow: "rgba(117,226,224,0.25)",
    description:
      "Guided breathing exercises to calm your nervous system, reduce anxiety, and bring you back to the present moment — in as little as two minutes.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M8 12a4 4 0 018 0"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
      </svg>
    ),
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12)  return "Good to see you this morning";
  if (hour >= 12 && hour < 17) return "Good to have you here";
  if (hour >= 17 && hour < 21) return "Good to see you this evening";
  if (hour >= 21 || hour < 2)  return "Glad you're here tonight";

  return "Glad you reached out"; // 2am – 5am
};


/* ─────────────────────────────────────────────
   STYLES — 
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  .serene-dash * { box-sizing: border-box; }

  @keyframes db-blob1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(8%,-10%) scale(1.08); }
    66%     { transform: translate(-6%,12%) scale(0.94); }
  }
  @keyframes db-blob2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(-10%,8%) scale(1.12); }
    70%     { transform: translate(9%,-9%) scale(0.92); }
  }
  @keyframes db-blob3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(5%,10%) scale(1.06); }
  }
  @keyframes db-particle {
    0%   { transform: translateY(0);      opacity: 0.5; }
    100% { transform: translateY(-105vh); opacity: 0; }
  }
  @keyframes db-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes db-cardIn {
    from { opacity: 0; transform: translateY(36px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes db-lineGrow {
    from { width: 0; opacity: 0; }
    to   { width: 48px; opacity: 1; }
  }
  @keyframes db-pulseGlow {
    0%,100% { text-shadow: 0 0 40px rgba(44,172,173,0.28), 0 0 80px rgba(2,77,96,0.14); }
    50%     { text-shadow: 0 0 70px rgba(44,172,173,0.52), 0 0 120px rgba(2,77,96,0.28); }
  }
  @keyframes db-modalIn {
    from { opacity: 0; transform: scale(0.96) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes db-welcomeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .db-card:hover .db-card-img  { transform: scale(1.06); }
  .db-card:hover .db-card-overlay { opacity: 1 !important; }
  .db-card:hover .db-arrow     { transform: translateX(5px); opacity: 1 !important; }
  .db-card:hover .db-tag       { background: rgba(44,172,173,0.22) !important; border-color: rgba(44,172,173,0.4) !important; }
  .db-card:focus-visible       { outline: 2px solid rgba(44,172,173,0.7); outline-offset: 3px; }

  @media (max-width: 900px) {
    .db-cards-row  { flex-direction: column !important; align-items: center !important; }
    .db-card-wrap  { width: 100% !important; max-width: 380px !important; }
  }
  @media (max-width: 480px) {
    .db-header        { padding: 76px 18px 0 !important; }
    .db-cards-section { padding: 16px 12px 32px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .db-blob, .db-particle { animation: none !important; }
    * { transition-duration: 0.01ms !important; }
  }
`;

function injectDashStyles() {
  if (document.getElementById("serene-dash-css")) return;
  const s = document.createElement("style");
  s.id = "serene-dash-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   ANIMATED BACKGROUND (unchanged)
───────────────────────────────────────────── */
function DashBg() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    dur: `${12 + Math.random() * 10}s`,
    op: (Math.random() * 0.22 + 0.04).toFixed(2),
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 100%, #1C4EA7 0%, #024D60 38%, #021F2E 100%)",
      }}/>
      <div className="db-blob" style={{
        position: "absolute", top: "-20%", left: "-8%",
        width: "min(75vw,720px)", height: "min(75vw,720px)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(44,172,173,0.55) 0%, transparent 68%)",
        filter: "blur(70px)", animation: "db-blob1 22s ease-in-out infinite", willChange: "transform",
      }}/>
      <div className="db-blob" style={{
        position: "absolute", top: "20%", right: "-15%",
        width: "min(65vw,640px)", height: "min(65vw,640px)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,78,167,0.52) 0%, transparent 65%)",
        filter: "blur(80px)", animation: "db-blob2 28s ease-in-out infinite", willChange: "transform",
      }}/>
      <div className="db-blob" style={{
        position: "absolute", bottom: "-15%", left: "25%",
        width: "min(60vw,580px)", height: "min(60vw,580px)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(2,77,96,0.65) 0%, transparent 64%)",
        filter: "blur(88px)", animation: "db-blob3 18s ease-in-out infinite", willChange: "transform",
      }}/>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}/>
      {particles.map(p => (
        <span key={p.id} className="db-particle" style={{
          position: "absolute", borderRadius: "50%",
          width: p.size, height: p.size, left: p.left, bottom: -8,
          background: `rgba(44,172,173,${p.op})`,
          animation: `db-particle ${p.dur} linear ${p.delay} infinite`,
        }}/>
      ))}
    </div>
  );
}



/* ─────────────────────────────────────────────
   FEATURE CARD (unchanged)
───────────────────────────────────────────── */
function FeatureCard({ card, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="db-card-wrap"
      style={{
        flex: "1 1 0", minWidth: 0,
        animation: `db-cardIn 0.65s cubic-bezier(0.34,1.2,0.64,1) both`,
        animationDelay: `${0.15 + index * 0.13}s`,
      }}
    >
      <div
        className="db-card"
        role="button" tabIndex={0}
        onClick={onClick}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && onClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden", cursor: "pointer",
          background: "rgba(2,40,52,0.52)",
          border: `1px solid ${hovered
            ? card.accentSoft.replace("0.18","0.38").replace("0.15","0.32").replace("0.2","0.35")
            : "rgba(217,245,240,0.1)"}`,
          backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
          boxShadow: hovered
            ? `0 28px 64px rgba(0,0,0,0.45), 0 0 0 1px ${card.accentSoft}, 0 0 48px ${card.accentGlow}`
            : "0 12px 40px rgba(0,0,0,0.28)",
          transform: hovered ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
          transition: "all 0.38s cubic-bezier(0.34,1.2,0.64,1)",
          display: "flex", flexDirection: "column", userSelect: "none",
        }}
      >
        {/* Image — 1:1 */}
        <div style={{ position: "relative", width: "100%", paddingTop: "100%", overflow: "hidden", flexShrink: 0 }}>
          <img src={card.image} alt={card.label} className="db-card-img" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}/>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(2,20,30,0.15) 0%, rgba(2,20,30,0.08) 40%, rgba(2,20,30,0.72) 100%)",
          }}/>
          <div className="db-card-overlay" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${card.accentSoft} 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
          }}/>
          {/* Tag */}
          <div className="db-tag" style={{
            position: "absolute", top: 13, left: 13, padding: "4px 11px",
            borderRadius: 50, background: "rgba(2,20,30,0.55)",
            border: "1px solid rgba(217,245,240,0.16)", backdropFilter: "blur(12px)",
            color: "rgba(217,245,240,0.75)", fontFamily: "'Jost', sans-serif",
            fontSize: "0.6rem", fontWeight: 300, letterSpacing: "0.22em",
            textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.25s ease",
          }}>
            <span style={{ color: card.accent, opacity: 0.9 }}>{card.icon}</span>
            {card.tag}
          </div>
          {/* Label */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "13px 16px 11px" }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem",
              fontWeight: 300, color: "#D9F5F0", letterSpacing: "0.06em",
              lineHeight: 1.15, textShadow: "0 2px 16px rgba(0,0,0,0.6)", margin: 0,
            }}>{card.label}</h3>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "15px 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, ${card.accent} 0%, transparent 100%)`,
            opacity: 0.35, animation: "db-lineGrow 0.7s ease both",
            animationDelay: `${0.3 + index * 0.13}s`,
          }}/>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.78rem",
            fontWeight: 200, lineHeight: 1.72,
            color: "rgba(217,245,240,0.55)", letterSpacing: "0.025em", margin: 0,
          }}>{card.description}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
            <span style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", fontWeight: 300,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: card.accent, opacity: 0.85,
            }}>Explore</span>
            <div className="db-arrow" style={{
              width: 30, height: 30, borderRadius: "50%",
              background: card.accentSoft,
              border: `1px solid ${card.accent.replace("1)", "0.3)")}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: card.accent, opacity: hovered ? 1 : 0.55,
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();

  const [userName,    setUserName]    = useState("");
  const [showModal,   setShowModal]   = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  useEffect(() => {
    injectDashStyles();

    const email     = localStorage.getItem("userEmail");
    const savedName = localStorage.getItem(`username_${email}`);
    

    if (!savedName) {
      // First login — show name modal
      setShowModal(true);
    } else {
      setUserName(savedName);

    }
  }, []);

  const handleNameSave = (name) => {
    const email = localStorage.getItem("userEmail");
    localStorage.setItem(`username_${email}`, name);
    setUserName(name);
    setShowModal(false);
  };

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
  setShowLogoutModal(true);
  
};

  return (
    <div
      className="serene-dash"
      style={{ position: "relative", minHeight: "100vh", overflowX: "hidden", overflowY: "auto" }}
    >
      <DashBg />

      {/* ── NAME MODAL — first login ── */}
      {showModal && <NameModal onSave={handleNameSave} />}

      

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── TOP BAR — logout button ── */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 36px",
          background: "rgba(1,18,26,0.28)",
          borderBottom: "1px solid rgba(217,245,240,0.07)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        }}>
          {/* Brand mark */}
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem", fontWeight: 300, letterSpacing: "0.28em",
            color: "rgba(217,245,240,0.55)",
          }}>
            SERENE
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 18px", borderRadius: 50,
              background: "rgba(217,245,240,0.05)",
              border: "1px solid rgba(217,245,240,0.14)",
              color: "rgba(217,245,240,0.45)",
              fontFamily: "'Jost', sans-serif", fontSize: "0.66rem",
              fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.22s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(220,80,80,0.12)";
              e.currentTarget.style.borderColor = "rgba(220,80,80,0.3)";
              e.currentTarget.style.color = "rgba(255,140,140,0.8)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(217,245,240,0.05)";
              e.currentTarget.style.borderColor = "rgba(217,245,240,0.14)";
              e.currentTarget.style.color = "rgba(217,245,240,0.45)";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>

        {/* ── HEADER — pushed down to clear fixed top bar ── */}
        <div
          className="db-header"
          style={{
            padding: "88px 48px 0",   // top padding accounts for fixed nav
            maxWidth: 1100,
            margin: "0 auto",
            animation: "db-fadeUp 0.7s ease both",
          }}
        >
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 500,
            letterSpacing: "0.42em", color: "rgba(44,172,173,0.65)",
            textTransform: "uppercase", marginBottom: 5,
          }}>
            Your Wellness Space
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 300,
            color: "#D9F5F0", letterSpacing: "0.18em", lineHeight: 1.1,
            animation: "db-pulseGlow 4.5s ease-in-out infinite", marginBottom: 1,
          }}>
            SERENE
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(1rem, 2.2vw, 1.3rem)", fontWeight: 500,
            color: "rgba(217,245,240,0.48)", letterSpacing: "0.06em",
            lineHeight: 1.5, marginBottom: 4,
            animation: "db-fadeUp 0.7s ease 0.1s both",
          }}>
               {userName
    ? `${getGreeting()}, ${userName}`
    : "Welcome"}
          </p>

          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 400,
            letterSpacing: "0.1em", color: "rgba(217,245,240,0.32)",
            marginTop: 10, animation: "db-fadeUp 0.7s ease 0.2s both",
          }}>
            Three pathways to emotional clarity — choose where to begin.
          </p>
        </div>

        {/* ── CARDS — slightly smaller gap & padding ── */}
        <div
          className="db-cards-section"
          style={{ padding: "24px 48px 48px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            className="db-cards-row"
            style={{ display: "flex", gap: 16, alignItems: "stretch" }}
          >
            {CARDS.map((card, i) => (
              <FeatureCard
                key={card.id}
                card={card}
                index={i}
                onClick={() => navigate(card.route)}
              />
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <p style={{
          textAlign: "center", fontFamily: "'Jost', sans-serif",
          fontSize: "1.0rem", letterSpacing: "0.18em",
          color: "rgba(149,241,224,0.9)", fontWeight: 200,
          paddingBottom: 32, animation: "db-fadeUp 0.7s ease 0.5s both",
        }}>
          SERENE · Your thoughts are safe here · Made with care
        </p>
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