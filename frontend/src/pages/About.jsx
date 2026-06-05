import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { injectGlobalStyles, SereneBg } from "../utils/sereneStyles.jsx";

const features = [
  {
    icon: "💬",
    title: "Emotional Support Chatbot",
    body: "SERENE includes an intelligent chatbot that provides a safe space to express your thoughts. It responds in a natural and empathetic manner, helping you process emotions, gain clarity, and feel heard without judgment.",
  },
  {
    icon: "📓",
    title: "Guided Journaling",
    body: "The journaling feature helps you reflect on your daily experiences. Based on your mood, SERENE provides thoughtful prompts to guide your writing. Over time, you can track emotional patterns through a visual calendar and gain deeper self-awareness.",
  },
  {
    icon: "𖦹", 
    title: "Breathing Exercises",
    body: "SERENE offers guided breathing exercises to help you calm your mind and body. One of the core techniques is Box Breathing (4-4-4): inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds — reducing stress and restoring focus.",
  },
];

export default function About() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay) =>
    ready
      ? { animation: `fadeUp 0.85s cubic-bezier(.22,1,.36,1) ${delay}s both` }
      : { opacity: 0 };

  return (
    <div style={{
      position:"relative", minHeight:"100vh", width:"100%",
      overflow:"hidden", fontFamily:"'Jost', sans-serif",
    }}>
      <SereneBg />

      {/* Scroll container */}
      <div style={{
        position:"relative", zIndex:10,
        maxWidth:720, margin:"0 auto",
        padding:"80px 24px 100px",
        display:"flex", flexDirection:"column",
        alignItems:"center",
      }}>
        {/* Nav back */}
        <div style={{ ...anim(0.05), width:"100%", marginBottom:15 }}>
          <span
            onClick={() => navigate("/")}
            style={{
              fontWeight:200, fontSize:"0.75rem",
              letterSpacing:"0.18em", textTransform:"uppercase",
              color:"rgba(217,245,240,0.42)", cursor:"pointer",
              transition:"color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color="#D9F5F0"}
            onMouseLeave={e => e.target.style.color="rgba(217,245,240,0.42)"}
          >
            ← Back to home
          </span>
        </div>

        {/* Header */}
        <p style={{
          ...anim(0.12),
          fontFamily:"'Jost', sans-serif", fontWeight:200,
          fontSize:"1.0rem", letterSpacing:"0.32em",
          textTransform:"uppercase",
          color:"rgba(217,245,240,0.42)", marginBottom:10,
        }}>
          About
        </p>

        <h1 style={{
          ...anim(0.2),
          fontFamily:"'Cormorant Garamond', serif", fontWeight:300,
          fontSize:"clamp(2.4rem, 8vw, 4rem)",
          color:"#D9F5F0", textAlign:"center",
          letterSpacing:"0.14em", lineHeight:1.1,
          marginBottom:15,
        }}>
          SERENE
        </h1>

        {/* Divider */}
        <div style={{
          height:1, width:"100%", marginBottom:28,
          background:"linear-gradient(90deg, transparent, rgba(44,172,173,0.5), transparent)",
          animation: ready ? "lineGrow 0.9s cubic-bezier(.22,1,.36,1) 0.32s both" : "none",
        }}/>

        <p style={{
          ...anim(0.35),
          fontFamily:"'Cormorant Garamond', serif",
          fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(1.05rem, 3vw, 1.28rem)",
          color:"rgba(217,245,240,0.55)",
          textAlign:"center", lineHeight:1.8,
          maxWidth:540, marginBottom:64,
        }}>
          A mental wellness platform designed to help you understand, reflect,
          and regulate your emotions through guided tools and experiences.
        </p>

        {/* Feature cards */}
        <div style={{
          display:"flex", flexDirection:"column",
          gap:20, width:"100%",
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="s-glass"
              style={{
                ...anim(0.45 + i * 0.14),
                padding:"32px 36px",
                display:"flex", flexDirection:"column", gap:14,
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:"1.6rem" }}>{f.icon}</span>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontWeight:400,
                  fontSize:"clamp(1.1rem, 3vw, 1.35rem)",
                  color:"#D9F5F0",
                  letterSpacing:"0.04em",
                }}>
                  {f.title}
                </h2>
              </div>

              <div style={{
                height:1,
                background:"linear-gradient(90deg, rgba(44,172,173,0.3), transparent)",
              }}/>

              <p style={{
                fontWeight:200, fontSize:"0.88rem",
                color:"rgba(217,245,240,0.58)",
                lineHeight:1.85, letterSpacing:"0.02em",
              }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          ...anim(0.85),
          marginTop:64, display:"flex",
          flexDirection:"column", alignItems:"center", gap:16,
        }}>
          <p style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontStyle:"italic", fontWeight:300,
            fontSize:"1.1rem", color:"rgba(217,245,240,0.45)",
            letterSpacing:"0.04em",
          }}>
            Ready to begin?
          </p>
          <div style={{ display:"flex", gap:14 }}>
            <button
              className="s-btn s-btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding:"13px 36px", fontSize:"0.76rem" }}
            >
              Get started
            </button>
            <button
              className="s-btn"
              onClick={() => navigate("/login")}
              style={{
                padding:"13px 36px", fontSize:"0.76rem",
                background:"rgba(217,245,240,0.08)",
                color:"#D9F5F0",
                border:"1px solid rgba(217,245,240,0.22)",
                backdropFilter:"blur(10px)",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}