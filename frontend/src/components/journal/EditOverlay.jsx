import { useState } from "react";
import { MOODS } from "../../pages/JournalPage";

export default function EditOverlay({ data, onSave, onClose, loading }) {
  const [title,   setTitle]   = useState(data.title   || "");
  const [content, setContent] = useState(data.content || "");
  const [mood,    setMood]    = useState(data.mood     || "neutral");

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({ id: data.id, title, content, mood });
  };

  return (
    <div
      className="sj-modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sj-modal-card"
        style={{ maxWidth: 620 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <p style={{ fontSize: ".56rem", letterSpacing: ".3em", color: "rgba(44,172,173,.55)", textTransform: "uppercase", fontFamily: "'Jost',sans-serif", fontWeight: 300, marginBottom: 4 }}>
              Editing
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 300, color: "#D9F5F0", letterSpacing: ".04em" }}>
              Update Entry
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(217,245,240,.07)",
              border: "1px solid rgba(217,245,240,.12)",
              color: "rgba(217,245,240,.5)",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: ".8rem", transition: "all .2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,245,240,.14)"; e.currentTarget.style.color = "#D9F5F0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(217,245,240,.07)"; e.currentTarget.style.color = "rgba(217,245,240,.5)"; }}
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label className="sj-label">Title</label>
          <input
            className="sj-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Entry title…"
          />
        </div>

        {/* Mood */}
        <div style={{ marginBottom: 16 }}>
          <label className="sj-label">Mood</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {Object.entries(MOODS).map(([m, cfg]) => {
              const sel = mood === m;
              return (
                <button
                  key={m}
                  className={`sj-chip${sel ? " selected" : ""}`}
                  onClick={() => setMood(m)}
                  style={sel ? { background: cfg.color, borderColor: cfg.color, color: "#021F2E" } : {}}
                >
                  {cfg.emoji} {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: 6 }}>
          <label className="sj-label">Content</label>
          <textarea
            className="sj-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={7}
            style={{ minHeight: 160 }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              flex: "0 0 auto",
              padding: "12px 22px", borderRadius: 50,
              border: "1px solid rgba(217,245,240,.14)",
              background: "transparent",
              color: "rgba(217,245,240,.45)",
              fontFamily: "'Jost',sans-serif", fontSize: ".7rem",
              letterSpacing: ".16em", textTransform: "uppercase",
              cursor: "pointer", transition: "all .2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(217,245,240,.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(217,245,240,.14)"}
          >
            Cancel
          </button>
          <button
            className="sj-submit"
            style={{ flex: 1, marginTop: 0 }}
            onClick={handleSave}
            disabled={loading || !content.trim()}
          >
            {loading ? "Saving…" : "Update Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}