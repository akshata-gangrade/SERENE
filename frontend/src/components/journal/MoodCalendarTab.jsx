import { useState } from "react";
import { MOODS } from "../../pages/JournalPage";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ── Journal Read Modal ── */
function JournalModal({ journal, onClose }) {
  const cfg = MOODS[journal.mood] || { color: "#78909C", emoji: "😐" };
  const d = new Date(journal.created_at);
  const dateStr = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="sj-modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="sj-modal-card">
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(217,245,240,.07)",
            border: "1px solid rgba(217,245,240,.12)",
            color: "rgba(217,245,240,.5)",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: ".82rem", transition: "all .2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,245,240,.14)"; e.currentTarget.style.color = "#D9F5F0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(217,245,240,.07)"; e.currentTarget.style.color = "rgba(217,245,240,.5)"; }}
        >
          ✕
        </button>

        {/* Mood bar */}
        <div style={{ height: 4, borderRadius: 2, background: cfg.color, marginBottom: 20 }}/>

        {/* Date + mood */}
        <div style={{
          fontSize: ".6rem", letterSpacing: ".22em",
          color: "rgba(217,245,240,.32)", textTransform: "uppercase",
          fontFamily: "'Jost',sans-serif", fontWeight: 300, marginBottom: 8,
        }}>
          {dateStr} · {timeStr} · {journal.mood} {cfg.emoji}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "1.65rem", fontWeight: 300,
          color: "#D9F5F0", letterSpacing: ".04em", marginBottom: 18,
        }}>
          {journal.title || "Untitled"}
        </h2>

        {/* Content in handwriting font */}
        <p style={{
          fontFamily: "'Caveat',cursive",
          fontSize: "1.15rem", lineHeight: 1.85,
          color: "rgba(217,245,240,.78)",
        }}>
          {journal.content}
        </p>
      </div>
    </div>
  );
}

export default function MoodCalendarTab({ calendarData, journals }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [openJournal, setOpenJournal] = useState(null);

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  /* Build a lookup: "YYYY-M-D" → { mood, color, journalObj } */
  const buildLookup = () => {
    const map = {};
    // use calendarData from backend (mood + color per date)
    Object.entries(calendarData || {}).forEach(([dateStr, info]) => {
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      // find matching journal for click-to-read
      const matchJournal = journals.find(j => {
        const jd = new Date(j.created_at);
        return jd.getFullYear() === d.getFullYear() && jd.getMonth() === d.getMonth() && jd.getDate() === d.getDate();
      });
      map[key] = { mood: info.mood, color: info.color, journal: matchJournal };
    });
    return map;
  };

  const lookup = buildLookup();

  const changeMonth = (dir) => {
    setViewDate(new Date(y, m + dir, 1));
  };

  return (
    <div className="sj-panel">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p className="sj-eyebrow">Mood history</p>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(44,172,173,.1)",
              border: "1px solid rgba(44,172,173,.22)",
              color: "#75E2E0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", transition: "all .2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(44,172,173,.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(44,172,173,.1)"}
          >
            ‹
          </button>

          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "1.6rem", fontWeight: 300,
            color: "#D9F5F0", letterSpacing: ".08em",
          }}>
            {MONTH_NAMES[m]} {y}
          </h2>

          <button
            onClick={() => changeMonth(1)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(44,172,173,.1)",
              border: "1px solid rgba(44,172,173,.22)",
              color: "#75E2E0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", transition: "all .2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(44,172,173,.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(44,172,173,.1)"}
          >
            ›
          </button>
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {/* Day name headers */}
          {DAY_NAMES.map(d => (
            <div key={d} style={{
              textAlign: "center",
              fontSize: ".56rem", letterSpacing: ".2em",
              color: "rgba(217,245,240,.28)",
              textTransform: "uppercase",
              fontFamily: "'Jost',sans-serif",
              paddingBottom: 8, fontWeight: 300,
            }}>
              {d}
            </div>
          ))}

          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="sj-cal-day empty"/>
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = `${y}-${m + 1}-${day}`;
            const entry = lookup[key];
            const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day;

            /* Mood color from backend or from MOODS map */
            const moodColor = entry
              ? (entry.color || (MOODS[entry.mood] || { color: "#78909C" }).color)
              : null;

            return (
              <div
                key={day}
                className={`sj-cal-day${entry ? " has-entry" : ""}${isToday ? " today" : ""}`}
                style={entry ? {
                  background: moodColor + "22",
                  borderColor: moodColor + "55",
                } : {}}
                onClick={() => entry?.journal && setOpenJournal(entry.journal)}
                title={entry ? `${entry.mood} — click to read` : ""}
              >
                <span style={{ fontSize: ".8rem" }}>{day}</span>
                {entry && (
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: moodColor, marginTop: 3,
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mood Legend ── */}
        <div style={{ marginTop: 32 }}>
          <p style={{
            fontSize: ".56rem", letterSpacing: ".3em",
            color: "rgba(217,245,240,.26)", textTransform: "uppercase",
            fontFamily: "'Jost',sans-serif", fontWeight: 300,
            marginBottom: 14,
          }}>
            Mood Color Guide
          </p>

          {/* Divider */}
          <div style={{
            height: 1,
            background: "linear-gradient(90deg,rgba(44,172,173,.3) 0%,transparent 70%)",
            marginBottom: 16,
          }}/>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Object.entries(MOODS).map(([moodName, cfg]) => (
              <div
                key={moodName}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  fontFamily: "'Jost',sans-serif", fontSize: ".68rem",
                  fontWeight: 300, letterSpacing: ".1em",
                  color: "rgba(217,245,240,.48)",
                  textTransform: "capitalize",
                }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: cfg.color, flexShrink: 0,
                  boxShadow: `0 0 6px ${cfg.color}66`,
                }}/>
                {cfg.emoji} {moodName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal read modal */}
      {openJournal && (
        <JournalModal
          journal={openJournal}
          onClose={() => setOpenJournal(null)}
        />
      )}
    </div>
  );
}