import { useState } from "react";
import { MOODS } from "../../pages/JournalPage";

function JournalCard({ journal, onEdit, onDelete, index }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = MOODS[journal.mood] || { color: "#78909C", emoji: "😐" };

  const d = new Date(journal.created_at);
  const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
  const timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="sj-jcard"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Mood accent bar */}
      <div style={{ height: 3, borderRadius: 2, background: cfg.color, opacity: 0.7, marginBottom: 14 }}/>

      {/* Date */}
      <div style={{
        fontSize: ".6rem", letterSpacing: ".2em",
        color: "rgba(217,245,240,.32)", marginBottom: 6,
        fontFamily: "'Jost',sans-serif", textTransform: "uppercase", fontWeight: 300,
      }}>
        {dateStr} · {timeStr}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: "1.15rem", fontWeight: 400,
        color: "#D9F5F0", marginBottom: 8, letterSpacing: ".03em",
      }}>
        {journal.title || "Untitled"}
      </h3>

      {/* Preview in handwriting font */}
      <p style={{
        fontFamily: "'Caveat',cursive",
        fontSize: ".98rem", lineHeight: 1.6,
        color: "rgba(217,245,240,.48)",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {journal.content}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        {/* Mood badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 50,
          background: cfg.color + "22", color: cfg.color,
          border: `1px solid ${cfg.color}44`,
          fontSize: ".62rem", letterSpacing: ".12em",
          textTransform: "capitalize", fontFamily: "'Jost',sans-serif", fontWeight: 300,
        }}>
          {cfg.emoji} {journal.mood}
        </span>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onEdit(journal)}
            style={{
              padding: "5px 14px", borderRadius: 50,
              background: "rgba(44,172,173,.14)",
              border: "1px solid rgba(44,172,173,.24)",
              color: "#75E2E0",
              fontFamily: "'Jost',sans-serif", fontSize: ".62rem",
              letterSpacing: ".14em", textTransform: "uppercase",
              cursor: "pointer", transition: "all .2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(44,172,173,.26)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(44,172,173,.14)"}
          >
            Edit
          </button>

          {confirmDelete ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => { onDelete(journal.id); setConfirmDelete(false); }}
                style={{
                  padding: "5px 12px", borderRadius: 50,
                  background: "rgba(220,80,80,.22)",
                  border: "1px solid rgba(220,80,80,.4)",
                  color: "rgba(255,140,140,.9)",
                  fontFamily: "'Jost',sans-serif", fontSize: ".6rem",
                  letterSpacing: ".12em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "5px 10px", borderRadius: 50,
                  background: "rgba(217,245,240,.06)",
                  border: "1px solid rgba(217,245,240,.12)",
                  color: "rgba(217,245,240,.45)",
                  fontFamily: "'Jost',sans-serif", fontSize: ".6rem",
                  letterSpacing: ".12em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                padding: "5px 14px", borderRadius: 50,
                background: "rgba(220,80,80,.08)",
                border: "1px solid rgba(220,80,80,.18)",
                color: "rgba(255,130,130,.65)",
                fontFamily: "'Jost',sans-serif", fontSize: ".62rem",
                letterSpacing: ".14em", textTransform: "uppercase",
                cursor: "pointer", transition: "all .2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(220,80,80,.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(220,80,80,.08)"}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SavedJournalsTab({ journals, onEdit, onDelete }) {
  return (
    <div className="sj-panel">
      <p className="sj-eyebrow">Your entries</p>
      <h2 className="sj-section-title">Saved Journals</h2>

      {journals.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "rgba(217,245,240,.28)",
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic", fontSize: "1.1rem", letterSpacing: ".04em",
        }}>
          No entries yet — write your first journal.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {journals.map((j, i) => (
            <JournalCard
              key={j.id}
              journal={j}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}