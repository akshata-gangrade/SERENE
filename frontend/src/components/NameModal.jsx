import { useState } from "react";

export default function NameModal({ onSave }) {
  const [name, setName] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        background: "rgba(2, 18, 28, 0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",

          padding: "34px 30px",

          borderRadius: "28px",

          background:
            "linear-gradient(180deg, rgba(5,25,35,0.96) 0%, rgba(3,18,28,0.96) 100%)",

          border: "1px solid rgba(117,226,224,0.12)",

          boxShadow:
            "0 20px 80px rgba(0,0,0,0.45), 0 0 40px rgba(44,172,173,0.08)",

          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div
          style={{
            color: "#75E2E0",
            fontSize: "0.72rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            marginBottom: "14px",
            opacity: 0.7,
          }}
        >
          Welcome
        </div>

        <h2
          style={{
            color: "#D9F5F0",
            fontSize: "2rem",
            fontWeight: 400,
            marginBottom: "14px",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          What should we call you?
        </h2>

        <p
          style={{
            color: "rgba(217,245,240,0.6)",
            marginBottom: "24px",
            lineHeight: 1.6,
            fontSize: "0.95rem",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          This helps SERENE create a more personal and comforting experience.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "16px 18px",

            borderRadius: "16px",
            border: "1px solid rgba(117,226,224,0.18)",

            background: "rgba(255,255,255,0.04)",

            color: "#D9F5F0",

            outline: "none",

            fontSize: "0.95rem",
            fontFamily: "'Jost', sans-serif",

            marginBottom: "18px",

            backdropFilter: "blur(10px)",
          }}
        />

        <button
          onClick={() => name.trim() && onSave(name)}
          style={{
            width: "100%",
            padding: "15px",

            border: "none",
            borderRadius: "16px",

            cursor: "pointer",

            background:
              "linear-gradient(135deg, #2CACAD 0%, #024D60 100%)",

            color: "#D9F5F0",

            fontSize: "0.92rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",

            transition: "all 0.25s ease",

            boxShadow:
              "0 8px 24px rgba(44,172,173,0.22)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}