import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { injectGlobalStyles, SereneBg } from "../utils/sereneStyles.jsx";
import RegisterSuccessModal from "../components/RegisterSuccessModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [ready, setReady]       = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);


  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await API.post("/api/auth/register", { username, email, password });
      setShowSuccessModal(true);
    } catch (err) {
  const detail = err.response?.data?.detail;

  if (detail === "User already exists") {
    setError("An account with this email already exists.");
  }

  else if (Array.isArray(detail)) {
    const msg = detail[0].msg;

    if (msg.toLowerCase().includes("email")) {
      setError("Please enter a valid email address.");
    }

    else if (msg.toLowerCase().includes("at least 3")) {
      setError("Password must contain at least 3 characters.");
    }

    else if (
      msg.includes("Username can contain only letters")
    ) {
      setError("Username can contain only letters.");
    }

    else {
      setError(
        msg.replace("Value error, ", "")
      );
    }
  }

  else if (typeof detail === "string") {
    setError(detail);
  }

  else {
    setError("Unable to connect to server.");
  }
}
  finally {
    setLoading(false);
  }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleRegister(); };

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
          fontSize:"clamp(1.8rem, 5vw, 2.3rem)",
          color:"#D9F5F0", textAlign:"center",
          letterSpacing:"0.06em", lineHeight:1.2,
          marginBottom:8,
        }}>
          Begin your journey
        </h1>

        <p style={{
          ...anim(0.30),
          fontWeight:200, fontSize:"0.83rem",
          color:"rgba(217,245,240,0.42)",
          textAlign:"center", letterSpacing:"0.05em",
          marginBottom:34,
        }}>
          Create your SERENE account
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
            <label style={labelStyle}>Username</label>
            <input
              className="s-input"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

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
              placeholder="Enter Password"
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
                color: "#888",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            marginTop:14, fontSize:"0.78rem",
            color:"rgba(255,160,140,0.85)", textAlign:"center",
          }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <div style={{ ...anim(0.52), marginTop:28 }}>
          <button
            className="s-btn s-btn-primary"
            onClick={handleRegister}
            disabled={loading}
            style={{
              width:"100%", padding:"15px",
              fontSize:"0.8rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </div>

        {/* Footer link */}
        <p style={{
          ...anim(0.62),
          marginTop:24, textAlign:"center",
          fontSize:"0.8rem", fontWeight:200,
          color:"rgba(217,245,240,0.38)",
          letterSpacing:"0.04em",
        }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color:"#2CACAD", fontWeight:300,
              cursor:"pointer", letterSpacing:"0.06em",
              borderBottom:"1px solid rgba(44,172,173,0.4)",
              paddingBottom:1,
              transition:"color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color="#75E2E0"}
            onMouseLeave={e => e.target.style.color="#2CACAD"}
          >
            Login
          </span>
        </p>
      </div>
{showSuccessModal && (
  <RegisterSuccessModal
    onContinue={() => {
      setShowSuccessModal(false);
      navigate("/login");
    }}
  />
)}
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