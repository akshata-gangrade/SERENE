import { useState } from "react";

/* ── Send icon ── */
function SendIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#D9F5F0" : "rgba(217,245,240,0.55)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "stroke 0.2s ease" }}>
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

export default function ChatInput({ input, setInput, sendMessage }) {
  const [focused, setFocused] = useState(false);
  const hasText = input.trim().length > 0;

  /* Preserved original Enter-to-send */
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "12px 20px 22px", flexShrink: 0 }}>

      {/* Floating pill container */}
      <div style={{
        maxWidth: 680,
        margin: "0 auto",
        background: "rgba(2,40,52,0.58)",
        border: `1px solid ${focused
          ? "rgba(44,172,173,0.45)"
          : "rgba(217,245,240,0.13)"}`,
        borderRadius: 50,
        backdropFilter: "blur(24px) saturate(1.3)",
        WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        boxShadow: focused
          ? "0 8px 40px rgba(0,0,0,0.28), 0 0 0 3px rgba(44,172,173,0.1) inset, 0 0 36px rgba(44,172,173,0.07)"
          : "0 8px 40px rgba(0,0,0,0.22)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 8px 8px 22px",
        transition: "border-color 0.25s ease, box-shadow 0.3s ease",
      }}>

        {/* Text input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Share what's on your mind…"
          autoComplete="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#D9F5F0",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 300,
            letterSpacing: "0.04em",
            padding: "8px 0",
            caretColor: "#2CACAD",
          }}
        />

        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={!hasText}
          aria-label="Send message"
          style={{
            width: 42, height: 42,
            borderRadius: "50%",
            flexShrink: 0,
            border: "none",
            cursor: hasText ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hasText
              ? "linear-gradient(135deg, #2CACAD 0%, #024D60 100%)"
              : "rgba(44,172,173,0.1)",
            boxShadow: hasText
              ? "0 4px 20px rgba(44,172,173,0.4)"
              : "none",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            transform: hasText ? "scale(1)" : "scale(0.92)",
          }}
          onMouseEnter={e => {
            if (hasText) e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = hasText ? "scale(1)" : "scale(0.92)";
          }}
          onMouseDown={e => {
            if (hasText) e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={e => {
            if (hasText) e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <SendIcon active={hasText} />
        </button>
      </div>

      {/* Subtle hint */}
      <p style={{
        textAlign: "center",
        fontSize: "0.6rem",
        letterSpacing: "0.14em",
        color: "rgba(217,245,240,0.18)",
        marginTop: 10,
        fontWeight: 200,
        fontFamily: "'Jost', sans-serif",
      }}>
        SERENE · Your thoughts are safe here
      </p>
    </div>
  );
}