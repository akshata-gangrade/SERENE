import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { injectGlobalStyles, SereneBg } from "../utils/sereneStyles.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay, extra = "") => ({
    animation: ready
      ? `fadeUp 0.85s cubic-bezier(.22,1,.36,1) ${delay}s both${extra ? `, ${extra}` : ""}`
      : "none",
    opacity: ready ? undefined : 0,
  });

  return (
    <div style={{
      position:"relative", height:"100vh", width:"100%",
      overflow:"hidden", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Jost', sans-serif",
    }}>
      <SereneBg />

      <div style={{
        position:"relative", zIndex:10,
        display:"flex", flexDirection:"column",
        alignItems:"center", textAlign:"center",
        padding:"0 24px", maxWidth:680,
      }}>
        {/* Title */}
        <h1 style={{
          ...anim(0.1, "pulseGlow 5s ease-in-out 1.1s infinite"),
          fontFamily:"'Cormorant Garamond', serif",
          fontWeight:300,
          fontSize:"clamp(4.2rem, 14vw, 8rem)",
          letterSpacing:"0.24em",
          color:"#D9F5F0",
          lineHeight:1,
        }}>
          SERENE
        </h1>

        {/* Divider */}
        <div style={{
          height:1,
          background:"linear-gradient(90deg, transparent, rgba(44,172,173,0.75), transparent)",
          margin:"22px auto 0",
          animation: ready ? "lineGrow 1s cubic-bezier(.22,1,.36,1) 0.55s both" : "none",
          width: ready ? undefined : 0,
        }}/>

        {/* Tagline */}
        <p style={{
          ...anim(0.38),
          fontFamily:"'Jost', sans-serif", fontWeight:200,
          fontSize:"clamp(0.78rem, 2.4vw, 0.98rem)",
          letterSpacing:"0.3em", textTransform:"uppercase",
          color:"rgba(217,245,240,0.68)", marginTop:22, lineHeight:1.8,
        }}>
          curating calmness for the mind that never rests.
        </p>

        <p style={{
          ...anim(0.52),
          fontFamily:"'Cormorant Garamond', serif", fontWeight:400,
          fontStyle:"italic",
          fontSize:"clamp(1rem, 2.8vw, 1.22rem)",
          color:"rgba(217,245,240,0.48)", marginTop:10,
        }}>
          Heal gently, grow deeply &amp; breathe freely
        </p>

        {/* Buttons */}
        <div style={{
          ...anim(0.68),
          marginTop:48, display:"flex", gap:14,
          flexWrap:"wrap", justifyContent:"center",
        }}>
          <button
            className="s-btn s-btn-primary"
            onClick={() => navigate("/login")}
            style={{ padding:"14px 40px", fontSize:"0.76rem" }}
          >
            Login
          </button>

          <button
            className="s-btn"
            onClick={() => navigate("/register")}
            style={{
              padding:"14px 40px", fontSize:"0.76rem",
              background:"rgba(217,245,240,0.09)",
              color:"#D9F5F0",
              border:"1px solid rgba(217,245,240,0.26)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 2px 16px rgba(0,0,0,0.15)",
            }}
          >
            Register
          </button>

          <button
            className="s-btn"
            onClick={() => navigate("/about")}
            style={{
              padding:"14px 40px", fontSize:"0.76rem",
              background:"transparent",
              color:"rgba(217,245,240,0.6)",
              border:"1px solid rgba(217,245,240,0.18)",
            }}
          >
            Learn More
          </button>
        </div>

        {/* Trust line */}
        <p style={{
          ...anim(0.88),
          marginTop:42, fontSize:"0.68rem",
          letterSpacing:"0.22em", textTransform:"uppercase",
          color:"rgba(217,245,240,0.26)",
        }}>
          Private &nbsp;·&nbsp; Calming &nbsp;·&nbsp; Always free to start
        </p>
      </div>
    </div>
  );
}