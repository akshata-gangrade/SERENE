import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import NewJournalTab    from "../components/journal/NewJournalTab";
import SavedJournalsTab from "../components/journal/SavedJournalsTab";
import MoodCalendarTab  from "../components/journal/MoodCalendarTab";
import EditOverlay      from "../components/journal/EditOverlay";
import { injectJournalStyles, SereneBg } from "../styles/journalStyles";

/* ─────────────────────────────────────────────
   MOODS — 
───────────────────────────────────────────── */
export const MOODS = {
  happy:       { color: "#FFD166", emoji: "😊" },
  sad:         { color: "#6B8CAE", emoji: "😢" },
  angry:       { color: "#EF6C6C", emoji: "😠" },
  anxious:     { color: "#B39DDB", emoji: "😰" },
  excited:     { color: "#FF8C42", emoji: "🤩" },
  tired:       { color: "#90A4AE", emoji: "😴" },
  neutral:     { color: "#78909C", emoji: "😐" },
  grateful:    { color: "#66BB6A", emoji: "🙏" },
  lonely:      { color: "#4FC3F7", emoji: "🌧️" },
  overwhelmed: { color: "#CE93D8", emoji: "🌀" },
};

/* ─────────────────────────────────────────────
   TAB ICONS
───────────────────────────────────────────── */
const TAB_CONFIG = [
  {
    id: "new",
    label: "New Journal",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved Journals",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function JournalPage() {
  const navigate = useNavigate();

  // ── Original state — unchanged ──
  const [journals,   setJournals]   = useState([]);
  const [content,    setContent]    = useState("");
  const [mood,       setMood]       = useState("happy");
  const [title,      setTitle]      = useState("");
  const [prompt,     setPrompt]     = useState("");
  const [editingId,  setEditingId]  = useState(null);

  // ── UI-only state ──
  const [activeTab,     setActiveTab]     = useState("new");
  const [calendarData,  setCalendarData]  = useState({});
  const [editData,      setEditData]      = useState(null); // { id, title, content, mood }
  const [loading,       setLoading]       = useState(false);

  useEffect(() => { injectJournalStyles(); }, []);

  // ── Original: fetch journals ──
  const fetchJournals = async () => {
    try {
      const res = await API.get("/api/journal");
      setJournals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch mood calendar ──
  const fetchCalendar = async () => {
    try {
      const res = await API.get("/api/journal/calendar");
      setCalendarData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchCalendar();
  }, []);

  // ── Original: prompt based on mood ──
  const fetchPrompt = async () => {
  try {
    const res = await API.get(
      `/api/journal/prompt/${mood}?t=${Date.now()}`
    );

    setPrompt(res.data.prompt);
  } catch (err) {
    console.error(err);
    setPrompt("How was your day?");
  }
};
 useEffect(() => {
  fetchPrompt();
}, [mood]);

  // ── Original: create / update ──
  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/api/journal/${editingId}`, { title, content, mood });
        setEditingId(null);
      } else {
        await API.post("/api/journal", { title, content, mood });
      }
      setTitle("");
      setContent("");
      setMood("happy");
      setEditingId(null);
      await fetchJournals();
      await fetchCalendar();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ── Original: edit — now opens EditOverlay instead of scrolling ──
  const handleEdit = (j) => {
    setEditData({ id: j.id, title: j.title || "", content: j.content, mood: j.mood });
  };

  // ── Save edit from overlay ──
  const handleSaveEdit = async ({ id, title: t, content: c, mood: m }) => {
    setLoading(true);
    try {
      await API.put(`/api/journal/${id}`, { title: t, content: c, mood: m });
      setEditData(null);
      await fetchJournals();
      await fetchCalendar();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ── Original: delete ──
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/journal/${id}`);
      await fetchJournals();
      await fetchCalendar();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Tab switch ──
  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "saved")    fetchJournals();
    if (tab === "calendar") fetchCalendar();
  };

  return (
    <div
      className="sj-root"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#021F2E",
        color: "#D9F5F0",
        fontFamily: "'Jost', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SereneBg />

      {/* ── TOP NAV ── */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px 13px",
        borderBottom: "1px solid rgba(217,245,240,0.08)",
        background: "rgba(1,18,26,0.28)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        position: "relative", zIndex: 10,
      }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.45rem", fontWeight: 300, letterSpacing: ".22em", color: "#D9F5F0", animation: "sj-glow 4s ease-in-out infinite" }}>
            SERENE
          </div>
          <div style={{ fontSize: ".58rem", letterSpacing: ".3em", color: "rgba(44,172,173,.55)", textTransform: "uppercase", fontWeight: 300, marginTop: 2 }}>
            Mindful Journal
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="sj-back-btn"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          SERENE's Home Page
        </button>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        padding: "0 32px",
        borderBottom: "1px solid rgba(217,245,240,0.08)",
        background: "rgba(1,18,26,0.18)",
        position: "relative", zIndex: 10,
      }}>
        {TAB_CONFIG.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`sj-tab${activeTab === tab.id ? " active" : ""}`}
          >
            <span style={{ opacity: 0.75, display: "flex" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PANELS ── */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {activeTab === "new" && (
          <NewJournalTab
            title={title}          setTitle={setTitle}
            content={content}      setContent={setContent}
            mood={mood}            setMood={setMood}
            prompt={prompt}
            fetchPrompt={fetchPrompt}
            editingId={editingId}
            loading={loading}
            onSubmit={handleSubmit}
            onCancelEdit={() => { setEditingId(null); setTitle(""); setContent(""); setMood("happy"); }}
          />
        )}

        {activeTab === "saved" && (
          <SavedJournalsTab
            journals={journals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "calendar" && (
          <MoodCalendarTab
            calendarData={calendarData}
            journals={journals}
          />
        )}
      </div>

      {/* ── EDIT OVERLAY (modal) ── */}
      {editData && (
        <EditOverlay
          data={editData}
          onSave={handleSaveEdit}
          onClose={() => setEditData(null)}
          loading={loading}
        />
      )}
    </div>
  );
}