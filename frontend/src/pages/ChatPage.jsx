import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import ChatBox from "../components/chat/ChatBox";
import ChatInput from "../components/chat/ChatInput";
import DeleteConversationModal from "../components/DeleteConversationModal";
import { SereneBg, injectGlobalStyles } from "../utils/sereneStyles.jsx";



/* ── Icons ── */
function IconPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

/* delete icon */
function IconTrash() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   SIDEBAR COMPONENT
──────────────────────────────────────────── */
function Sidebar({ conversations, activeChat, onNewChat, onLoadMessages, onDeleteConversation, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            display: "none",
            position: "fixed", inset: 0, zIndex: 99,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            // shown via media query override below
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        width: 260, flexShrink: 0,
        display: "flex", flexDirection: "column",
        background: "rgba(1,28,38,0.54)",
        borderRight: "1px solid rgba(217,245,240,0.1)",
        backdropFilter: "blur(32px) saturate(1.3)",
        WebkitBackdropFilter: "blur(32px) saturate(1.3)",
        overflow: "hidden",
        position: "relative", zIndex: 10,
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Brand header */}
        <div style={{
          padding: "26px 20px 18px",
          borderBottom: "1px solid rgba(217,245,240,0.09)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.85rem",
              fontWeight: 300,
              letterSpacing: "0.24em",
              color: "#D9F5F0",
              textShadow: "0 0 40px rgba(44,172,173,0.45), 0 0 90px rgba(2,77,96,0.22)",
              lineHeight: 1,
            }}>
              SERENE
            </span>
            <span style={{
              fontSize: "0.6rem",
              fontWeight: 200,
              letterSpacing: "0.38em",
              color: "rgba(217,245,240,0.35)",
              textTransform: "uppercase",
              fontFamily: "'Jost', sans-serif",
            }}>
              Take a moment for yourself
            </span>
          </div>
        </div>

        {/* New Chat button */}
        <div style={{ padding: "16px 14px 0" }}>
          <button
            onClick={onNewChat}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px",
              borderRadius: 50,
              background: "linear-gradient(135deg, rgba(44,172,173,0.18) 0%, rgba(2,77,96,0.28) 100%)",
              border: "1px solid rgba(44,172,173,0.25)",
              color: "#75E2E0",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 300,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(44,172,173,0.32) 0%, rgba(2,77,96,0.44) 100%)";
              e.currentTarget.style.borderColor = "rgba(44,172,173,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(44,172,173,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(44,172,173,0.18) 0%, rgba(2,77,96,0.28) 100%)";
              e.currentTarget.style.borderColor = "rgba(44,172,173,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <IconPlus />
            New Conversation
          </button>
        </div>

        {/* History label */}
        <p style={{
          padding: "20px 20px 8px",
          fontSize: "0.58rem",
          letterSpacing: "0.28em",
          color: "rgba(217,245,240,0.28)",
          textTransform: "uppercase",
          fontWeight: 300,
          fontFamily: "'Jost', sans-serif",
        }}>
          Recent
        </p>

        {/* Conversation list */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 10px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(44,172,173,0.18) transparent",
        }}>
          {conversations.map((chat, idx) => (
            <div
              key={chat._id}
              onClick={() => { onLoadMessages(chat._id); onClose(); }}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                cursor: "pointer",
                marginBottom: 3,
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontSize: "0.82rem",
                fontWeight: 300,
                fontFamily: "'Jost', sans-serif",
                color: activeChat === chat._id
                  ? "rgba(217,245,240,0.95)"
                  : "rgba(217,245,240,0.48)",
                background: activeChat === chat._id
                  ? "rgba(44,172,173,0.13)"
                  : "transparent",
                border: activeChat === chat._id
                  ? "1px solid rgba(44,172,173,0.2)"
                  : "1px solid transparent",
                boxShadow: activeChat === chat._id
                  ? "0 2px 16px rgba(44,172,173,0.08)"
                  : "none",
                transition: "all 0.2s ease",
                overflow: "hidden",
                animation: `sidebarItemIn 0.3s ease both`,
                animationDelay: `${idx * 0.04}s`,
              }}
              onMouseEnter={e => {
                if (activeChat !== chat._id) {
                  e.currentTarget.style.background = "rgba(44,172,173,0.07)";
                  e.currentTarget.style.color = "rgba(217,245,240,0.78)";
                  e.currentTarget.style.borderColor = "rgba(44,172,173,0.1)";
                }
              }}
              onMouseLeave={e => {
                if (activeChat !== chat._id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(217,245,240,0.48)";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              <span style={{ opacity: 0.5, flexShrink: 0 }}>
  <IconChat />
</span>

<span
  style={{
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  }}
>
  {chat.title}
</span>

<button
  onClick={(e) => {
    e.stopPropagation();
    onDeleteConversation(chat._id);
  }}
  style={{
    background: "transparent",
    border: "none",
    color: "rgba(217,245,240,0.25)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: 8,
    flexShrink: 0,
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background =
      "rgba(255,255,255,0.05)";
    e.currentTarget.style.color =
      "rgba(255,120,120,0.9)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background =
      "transparent";
    e.currentTarget.style.color =
      "rgba(217,245,240,0.25)";
  }}
>
  <IconTrash />
</button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}




/* ────────────────────────────────────────────
   GREETING COMPONENT
──────────────────────────────────────────── */

function GreetingScreen({
  greeting,
  setInput,
  sendMessage
}) {
  const suggestions = [
  "Help me clear my thoughts",
  "I want to organize my thoughts",
  "Let's talk about my day",
  "I need help slowing down",
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px 40px",
      animation: "fadeUp 0.9s ease both",
      flex: 1,
    }}>
      {/* Eyebrow */}
      <p style={{
        fontSize: "0.62rem",
        letterSpacing: "0.4em",
        color: "rgba(44,172,173,0.6)",
        textTransform: "uppercase",
        fontWeight: 300,
        fontFamily: "'Jost', sans-serif",
        marginBottom: 16,
      }}>
        Welcome
      </p>

      {/* Main greeting */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(1.9rem, 4vw, 2.75rem)",
        fontWeight: 300,
        color: "#D9F5F0",
        textAlign: "center",
        lineHeight: 1.28,
        maxWidth: 540,
        animation: "pulseGlow 4s ease-in-out infinite",
      }}>
        {greeting}
      </h1>

      {/* Sub */}
      <p style={{
        marginTop: 14,
        fontSize: "0.8rem",
        fontWeight: 200,
        letterSpacing: "0.1em",
        color: "rgba(217,245,240,0.32)",
        fontFamily: "'Jost', sans-serif",
      }}>
        I'm here to listen — without judgment, without rush.
      </p>

      {/* Divider */}
      <div style={{
        width: 40, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(44,172,173,0.4), transparent)",
        margin: "36px 0 28px",
      }}/>

      {/* Prompt suggestions */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
        maxWidth: 520,
      }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => {
            sendMessage(s);
          }}
            style={{
              padding: "9px 18px",
              borderRadius: 50,
              background: "rgba(2,40,52,0.55)",
              border: "1px solid rgba(217,245,240,0.11)",
              color: "rgba(217,245,240,0.55)",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 300,
              letterSpacing: "0.04em",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "all 0.22s ease",
              animation: `fadeUp 0.5s ease both`,
              animationDelay: `${0.2 + i * 0.08}s`,
              opacity: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(44,172,173,0.13)";
              e.currentTarget.style.borderColor = "rgba(44,172,173,0.28)";
              e.currentTarget.style.color = "rgba(217,245,240,0.85)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(2,40,52,0.55)";
              e.currentTarget.style.borderColor = "rgba(217,245,240,0.11)";
              e.currentTarget.style.color = "rgba(217,245,240,0.55)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────── */
export default function ChatPage() {
  // ── Original state — unchanged ──
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  

  // ── UI-only state (no backend impact) ──
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Inject global styles ──
  useEffect(() => { injectGlobalStyles(); }, []);

  // ── Original greeting logic — unchanged ──
  const greetings = [
    "How are you feeling today?",
    "What's been on your mind lately?",
    "Want to talk about something?",
    "How has your day been?",
    "Is there something you'd like to share?"
  ];

  const generateGreeting = (name) => {
    const random = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(`${name}, ${random}`);
  };

  // ── Original handlers — unchanged ──


  const typeResponse = async (text) => {
    let current = "";
    for (let char of text) {
      current += char;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { role: "assistant", content: current }];
        }
        return [...prev, { role: "assistant", content: current }];
      });
      await new Promise(res => setTimeout(res, 10));
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await API.get("/api/chat/conversations");
      setConversations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await API.get(`/api/chat/messages/${conversationId}`);
      setMessages(res.data.data);
      setActiveChat(conversationId);
    } catch (err) {
      console.error(err);
    }
  };
  /* delete func */
  const deleteConversation = async (conversationId) => {
  try {
    await API.delete(`/api/chat/conversation/${conversationId}`);

    if (activeChat === conversationId) {
      setMessages([]);
      setActiveChat(null);
    }

    fetchConversations();
  } catch (err) {
    console.error(err);
    alert("Failed to delete conversation");
  }
};


  const openDeleteModal = (conversationId) => {
  setChatToDelete(conversationId);
  setShowDeleteModal(true);
};

  const sendMessage = async (customMessage = null) => {
  const userMessage = customMessage || input;

  if (!userMessage.trim() || loading) return;
  setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    try {
      const res = await API.post("/api/chat/send", {
        message: userMessage,
        conversation_id: activeChat
      });
      const { response, conversation_id } = res.data;
      if (!activeChat) {
        setActiveChat(conversation_id);
        fetchConversations();
      }
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      await typeResponse(response);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const newChat = () => {
    setMessages([]);
    setActiveChat(null);
  };


useEffect(() => {
  fetchConversations();

  const email = localStorage.getItem("userEmail");
  const savedName = localStorage.getItem(`username_${email}`);

  if (savedName) {
    generateGreeting(savedName);
  } else {
    generateGreeting("Friend");
  }
}, []);


  // ────────────────────────────────────────
  //   RENDER
  // ────────────────────────────────────────
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

      {/* Animated background */}
      <SereneBg />

      {/* App shell */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}>

        {/* ── SIDEBAR ── */}
        <Sidebar
          conversations={conversations}
          activeChat={activeChat}
          onNewChat={() => { newChat(); setSidebarOpen(false); }}
          onLoadMessages={loadMessages}
          onDeleteConversation={openDeleteModal}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ── MAIN CONTENT ── */}
        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}>

          {/* ── HEADER ── */}
          <header style={{
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(217,245,240,0.08)",
            background: "rgba(1,18,26,0.28)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarOpen(s => !s)}
                aria-label="Toggle sidebar"
                style={{
                  display: "none", // shown via media query in global CSS
                  background: "none", border: "none",
                  cursor: "pointer", color: "#D9F5F0",
                  padding: 6, borderRadius: 8,
                }}
                className="mobile-menu-btn"
              >
                <IconMenu />
              </button>

              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                letterSpacing: "0.32em",
                color: "rgba(217,245,240,0.38)",
                textTransform: "uppercase",
              }}>
                Mental Wellness
              </span>
            </div>

            <button
            onClick={() => window.location.href = "/dashboard"}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 50,
              background: "rgba(44,172,173,0.1)",
              border: "1px solid rgba(44,172,173,0.22)",
              color: "rgba(217,245,240,0.65)",
              fontSize: "0.68rem", letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Jost', sans-serif", fontWeight: 300,
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(44,172,173,0.2)";
              e.currentTarget.style.color = "#D9F5F0";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(44,172,173,0.1)";
              e.currentTarget.style.color = "rgba(217,245,240,0.65)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            SERENE's Home Page
          </button>
          </header>

          {/* ── CHAT AREA ── */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {messages.length === 0 ? (
              /* Greeting screen */
              <GreetingScreen
  greeting={greeting}
  setInput={setInput}
  sendMessage={sendMessage}
/>
            ) : (
              /* Messages */
              <div style={{ flex: 1, overflow: "hidden" }}>
                <ChatBox messages={messages} />
              </div>
            )}
          </div>

          {/* ── INPUT ── */}
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </main>
      </div>
      {showDeleteModal && (
  <DeleteConversationModal
    onCancel={() => {
      setShowDeleteModal(false);
      setChatToDelete(null);
    }}
    onConfirm={async () => {
      await deleteConversation(chatToDelete);
      setShowDeleteModal(false);
      setChatToDelete(null);
    }}
  />
)}

     
      
    </div>
  );
}