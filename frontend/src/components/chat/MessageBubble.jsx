import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


/* ── Serenity leaf SVG — assistant avatar icon ── */
function AssistantIcon() {
  return (
    <div style={{
      width: 30, height: 30,
      borderRadius: "50%",
      flexShrink: 0,
      alignSelf: "flex-end",
      marginRight: 10,
      background: "linear-gradient(135deg, #2CACAD 0%, #024D60 100%)",
      border: "1px solid rgba(44,172,173,0.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 12px rgba(44,172,173,0.22)",
    }}>
      {/* Minimal sun/spark icon */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="rgba(217,245,240,0.85)" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    </div>
  );
}

export default function MessageBubble({ text, isUser }) {
  const isTyping = !isUser && text === "";
  const bubbleRef = useRef();

  /* Animate in on mount */
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = `translateY(14px) ${isUser ? "translateX(6px)" : "translateX(-6px)"}`;
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.38s ease, transform 0.38s cubic-bezier(0.34,1.3,0.64,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0) translateX(0)";
    });
  }, []);

  return (
    <div
      ref={bubbleRef}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        margin: "3px 0",
        padding: "0 4px",
      }}
    >
      {/* Assistant avatar — left side only */}
      {!isUser && <AssistantIcon />}

      {/* Bubble */}
      <div style={{
        maxWidth: "min(72%, 520px)",
        padding: isTyping ? "14px 20px" : "13px 18px",
        borderRadius: isUser
          ? "20px 20px 5px 20px"
          : "20px 20px 20px 5px",

        /* User bubble — teal-prussian gradient */
        ...(isUser ? {
          background: "linear-gradient(135deg, rgba(44,172,173,0.28) 0%, rgba(28,78,167,0.38) 100%)",
          border: "1px solid rgba(44,172,173,0.22)",
          color: "#D9F5F0",
          boxShadow: "0 4px 24px rgba(44,172,173,0.12), 0 1px 0 rgba(217,245,240,0.06) inset",
        } : {
          /* Assistant bubble — soft frosted glass */
          background: "rgba(2,40,52,0.62)",
          border: "1px solid rgba(217,245,240,0.1)",
          color: "rgba(217,245,240,0.9)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }),

        fontFamily: "'Jost', sans-serif",
        fontSize: "0.9rem",
        fontWeight: 300,
        lineHeight: 1.74,
        letterSpacing: "0.022em",
        wordBreak: "break-word",
      }}>
    


{isTyping ? <TypingIndicator /> : (
  isUser ? text : (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p style={{ margin: "0 0 8px 0", lineHeight: 1.74 }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul style={{ margin: "6px 0 8px 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol style={{ margin: "6px 0 8px 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>{children}</ol>
        ),
        li: ({ children }) => (
          <li style={{ lineHeight: 1.65, color: "rgba(217,245,240,0.88)" }}>{children}</li>
        ),
        strong: ({ children }) => (
          <strong style={{ color: "#75E2E0", fontWeight: 500 }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em style={{ color: "rgba(217,245,240,0.65)", fontStyle: "italic" }}>{children}</em>
        ),
        // Prevent any accidental heading bloat
        h1: ({ children }) => (
          <p style={{ fontWeight: 500, color: "#75E2E0", margin: "6px 0 4px" }}>{children}</p>
        ),
        h2: ({ children }) => (
          <p style={{ fontWeight: 500, color: "#75E2E0", margin: "6px 0 4px" }}>{children}</p>
        ),
        h3: ({ children }) => (
          <p style={{ fontWeight: 400, color: "rgba(217,245,240,0.75)", margin: "4px 0" }}>{children}</p>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
)}
      </div>
    </div>
  );
}