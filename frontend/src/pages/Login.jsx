import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { injectGlobalStyles, SereneBg } from "../utils/sereneStyles.jsx";

function IconEye() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.8 21.8 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-4.06 4.94" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);


  const handleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const res = await API.post("/api/auth/login", {
      email,
      password,
    });

   

    /* Save auth token */
    login(res.data.access_token);

    /* Save current user's email */
    localStorage.setItem("userEmail", email);

    navigate("/dashboard");

  } catch (err) {
    console.error(
      "Login error:",
      err.response?.data || err.message
    );

    setError("Invalid email or password. Please try again.");

  } finally {
    setLoading(false);
  }
};

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  const anim = (delay) =>
    ready
      ? { animation: `fadeUp 0.8s cubic-bezier(.22,1,.36,1) ${delay}s both` }
      : { opacity: 0 };

  return (
    <div style={{
      position:"relative", minHeight:"100vh", width:"100%",
      overflow:"hidden", display:"flex",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Jost', sans-serif",
    }}>
      <SereneBg />

      {/* Glass Card */}
      <div className="s-glass" style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:420,
        margin:"24px",
        padding:"48px 40px 44px",
        animation: ready ? "scaleIn 0.75s cubic-bezier(.22,1,.36,1) 0.05s both" : "none",
        opacity: ready ? undefined : 0,
      }}>
        {/* Brand mark */}
        <p style={{
          ...anim(0.15),
          fontFamily:"'Cormorant Garamond', serif",
          fontWeight:300, letterSpacing:"0.28em",
          fontSize:"0.75rem", textTransform:"uppercase",
          color:"rgba(217,245,240,0.45)",
          textAlign:"center", marginBottom:28,
        }}>
          SERENE
        </p>

        {/* Title */}
        <h1 style={{
          ...anim(0.22),
          fontFamily:"'Cormorant Garamond', serif",
          fontWeight:300,
          fontSize:"clamp(1.9rem, 5vw, 2.4rem)",
          color:"#D9F5F0", textAlign:"center",
          letterSpacing:"0.06em", lineHeight:1.2,
          marginBottom:8,
        }}>
          Welcome back
        </h1>

        <p style={{
          ...anim(0.3),
          fontWeight:200, fontSize:"0.83rem",
          color:"rgba(217,245,240,0.42)",
          textAlign:"center", letterSpacing:"0.05em",
          marginBottom:34,
        }}>
          Sign in to continue your journey
        </p>

        {/* Divider */}
        <div style={{
          height:1, marginBottom:34,
          background:"linear-gradient(90deg, transparent, rgba(44,172,173,0.35), transparent)",
          animation: ready ? "lineGrow 0.9s cubic-bezier(.22,1,.36,1) 0.35s both" : "none",
          width: ready ? "100%" : 0,
        }}/>

        {/* Fields */}
        <div style={{ ...anim(0.38), display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              className="s-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <div>
  <label style={labelStyle}>Password</label>

  <div style={{ position: "relative" }}>
    <input
      className="s-input"
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={handleKey}
      style={{ paddingRight: "40px" }}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(217,245,240,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showPassword ? <IconEyeOff /> : <IconEye />}
    </button>
  </div>
</div>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            marginTop:14, fontSize:"0.78rem",
            color:"rgba(255,160,140,0.85)", textAlign:"center",
            letterSpacing:"0.03em",
          }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <div style={{ ...anim(0.5), marginTop:28 }}>
          <button
            className="s-btn s-btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{
              width:"100%", padding:"15px",
              fontSize:"0.8rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </div>

        {/* Footer link */}
        <p style={{
          ...anim(0.6),
          marginTop:24, textAlign:"center",
          fontSize:"0.8rem", fontWeight:200,
          color:"rgba(217,245,240,0.38)",
          letterSpacing:"0.04em",
        }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color:"#2CACAD", fontWeight:300,
              cursor:"pointer", letterSpacing:"0.06em",
              borderBottom:"1px solid rgba(44,172,173,0.4)",
              paddingBottom:1,
              transition:"color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color="#75E2E0"}
            onMouseLeave={e => e.target.style.color="#2CACAD"}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display:"block",
  fontFamily:"'Jost', sans-serif",
  fontWeight:300,
  fontSize:"0.73rem",
  letterSpacing:"0.14em",
  textTransform:"uppercase",
  color:"rgba(217,245,240,0.42)",
  marginBottom:8,
};