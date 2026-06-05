import { useEffect, useRef, useState } from "react";
import { MOODS } from "../../pages/JournalPage";

/* ── Live date-time display ── */
function LiveDateTime() {
  const [dt, setDt] = useState("");

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      setDt(now.toLocaleDateString("en-US", opts));
    };
    fmt();
    const id = setInterval(fmt, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <input
      readOnly
      value={dt}
      className="sj-input"
      style={{ cursor: "default", color: "rgba(217,245,240,0.5)", fontSize: ".82rem" }}
    />
  );
}

/* ── Mood chip grid ── */
function MoodGrid({ selected, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Object.entries(MOODS).map(([m, cfg]) => {
        const isSelected = selected === m;
        return (
          <button
            key={m}
            className={`sj-chip${isSelected ? " selected" : ""}`}
            onClick={() => onSelect(m)}
            style={isSelected ? { background: cfg.color, borderColor: cfg.color, color: "#021F2E" } : {}}
          >
            {cfg.emoji} {m}
          </button>
        );
      })}
    </div>
  );
}

export default function NewJournalTab({ title, setTitle, content, setContent, mood, setMood, prompt, fetchPrompt, editingId, loading, onSubmit, onCancelEdit }) {
  const textareaRef = useRef();
  const [promptVisible, setPromptVisible] = useState(true);

  /* Animate prompt change */
  useEffect(() => {
    setPromptVisible(false);
    const t = setTimeout(() => setPromptVisible(true), 220);
    return () => clearTimeout(t);
  }, [prompt]);

  return (
    <div className="sj-panel">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Section header */}
        <p className="sj-eyebrow">{editingId ? "Editing entry" : "Write freely"}</p>
        <h2 className="sj-section-title">{editingId ? "Edit Entry" : "New Entry"}</h2>

        {/* Title + Date row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div>
            <label className="sj-label">Title</label>
            <input
              className="sj-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give this entry a name…"
            />
          </div>
          <div>
            <label className="sj-label">Date & Time</label>
            <LiveDateTime />
          </div>
        </div>

        {/* Mood */}
        <div style={{ marginBottom: 16 }}>
          <label className="sj-label">How are you feeling?</label>
          <MoodGrid selected={mood} onSelect={setMood} />
        </div>

        {/* AI Prompt */}
   <div className="sj-ai-prompt" style={{ marginBottom: 16 }}>
  
  <div className="sj-ai-icon">
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(217,245,240,0.85)"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  </div>

  <p
    className="sj-prompt-text"
    style={{
      opacity: promptVisible ? 1 : 0,
      flex: 1,
    }}
  >
    {prompt || "How was your day?"}
  </p>



</div>

        {/* Handwriting textarea */}
        <div>
          <label className="sj-label">Your thoughts</label>
          <textarea
            ref={textareaRef}
            className="sj-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Let your words flow freely here…"
            rows={9}
          />
          <div style={{ textAlign: "right", fontSize: ".6rem", letterSpacing: ".1em", color: "rgba(217,245,240,.22)", marginTop: 5, fontFamily: "'Jost',sans-serif" }}>
            {content.length} characters
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          {editingId && (
            <button
              onClick={onCancelEdit}
              style={{
                flex: "0 0 auto",
                padding: "13px 24px",
                borderRadius: 50,
                border: "1px solid rgba(217,245,240,.15)",
                background: "transparent",
                color: "rgba(217,245,240,.5)",
                fontFamily: "'Jost',sans-serif",
                fontSize: ".72rem",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all .2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(217,245,240,.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(217,245,240,.15)"}
            >
              Cancel
            </button>
          )}
          <button
            className="sj-submit"
            style={{ flex: 1, marginTop: 0 }}
            onClick={onSubmit}
            disabled={loading || !content.trim()}
          >
            {loading ? "Saving…" : editingId ? "Update Entry" : "Save Journal Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}