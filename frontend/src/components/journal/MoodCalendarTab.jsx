import { useState } from "react";
import { MOODS } from "../../pages/JournalPage";
import { useEffect } from "react";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ── Journal Read Modal ── */
function JournalModal({ journals, onClose }) {
  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
  };
}, []);
  const sortedJournals = [...journals].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const firstDate = new Date(sortedJournals[0].created_at);

  const dateStr = firstDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="sj-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sj-modal-card"
        style={{
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(217,245,240,.07)",
            border: "1px solid rgba(217,245,240,.12)",
            color: "rgba(217,245,240,.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: ".82rem",
          }}
        >
          ✕
        </button>

        <div
          style={{
            fontSize: ".6rem",
            letterSpacing: ".22em",
            color: "rgba(217,245,240,.32)",
            textTransform: "uppercase",
            fontFamily: "'Jost',sans-serif",
            fontWeight: 300,
            marginBottom: 18,
          }}
        >
          {dateStr} · {journals.length} entr{journals.length === 1 ? "y" : "ies"}
        </div>

        {sortedJournals.map((journal, index) => {
          const cfg = MOODS[journal.mood] || {
            color: "#78909C",
            emoji: "😐",
          };

          const d = new Date(journal.created_at);

          const timeStr = d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={journal.id || index}>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: cfg.color,
                  marginBottom: 16,
                }}
              />

              <div
                style={{
                  fontSize: ".6rem",
                  letterSpacing: ".18em",
                  color: "rgba(217,245,240,.32)",
                  textTransform: "uppercase",
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 300,
                  marginBottom: 8,
                }}
              >
                {timeStr} · {journal.mood} {cfg.emoji}
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.4rem",
                  fontWeight: 300,
                  color: "#D9F5F0",
                  marginBottom: 12,
                }}
              >
                {journal.title || "Untitled"}
              </h2>

              <p
                style={{
                  fontFamily: "'Caveat',cursive",
                  fontSize: "1.15rem",
                  lineHeight: 1.85,
                  color: "rgba(217,245,240,.78)",
                  marginBottom: 24,
                }}
              >
                {journal.content}
              </p>

              {index < sortedJournals.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(44,172,173,.3), transparent)",
                    margin: "24px 0",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MoodCalendarTab({ calendarData, journals }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  /*const [openJournal, setOpenJournal] = useState(null);*/
  const [openJournals, setOpenJournals] = useState([]);

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
      /*const matchJournal = journals.find(j => {
        const jd = new Date(j.created_at);
        return jd.getFullYear() === d.getFullYear() && jd.getMonth() === d.getMonth() && jd.getDate() === d.getDate();
      });*/
      const matchJournals = journals.filter(j => {
      const jd = new Date(j.created_at);

      return (
        jd.getFullYear() === d.getFullYear() &&
        jd.getMonth() === d.getMonth() &&
        jd.getDate() === d.getDate()
      );
    });
      map[key] = {mood: info.mood, color: info.color, journals: matchJournals};
    });
    return map;
  };

  const lookup = buildLookup();

  const changeMonth = (dir) => {
    setViewDate(new Date(y, m + dir, 1));
  };

  return (
    <div
  className="sj-panel"
  style={{
    overflow: openJournals.length > 0 ? "hidden" : undefined,
  }}
>
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
                onClick={() =>
  entry?.journals?.length &&
  setOpenJournals(entry.journals)
}
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
    {openJournals.length > 0 && (
  <JournalModal
    journals={openJournals}
    onClose={() => setOpenJournals([])}
  />
)}
    </div>
  );
}