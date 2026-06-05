import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages }) {
  const bottomRef = useRef();

  /* Preserved original auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      /* Custom scrollbar */
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(44,172,173,0.2) transparent",
    }}>
      {/* Inner container — centered, max width */}
      <div style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "32px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            text={msg.content}
            isUser={msg.role === "user"}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}