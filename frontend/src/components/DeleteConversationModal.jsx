export default function DeleteConversationModal({
  onCancel,
  onConfirm,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        background: "rgba(2, 18, 28, 0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",

          padding: "34px 30px",

          borderRadius: "28px",

          background:
            "linear-gradient(180deg, rgba(5,25,35,0.96) 0%, rgba(3,18,28,0.96) 100%)",

          border: "1px solid rgba(117,226,224,0.12)",

          boxShadow:
            "0 20px 80px rgba(0,0,0,0.45), 0 0 40px rgba(44,172,173,0.08)",

          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div
          style={{
            color: "#75E2E0",
            fontSize: "0.72rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            marginBottom: "14px",
            opacity: 0.7,
          }}
        >
          Conversation
        </div>

        <h2
          style={{
            color: "#D9F5F0",
            fontSize: "2rem",
            fontWeight: 400,
            marginBottom: "14px",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Delete Conversation?
        </h2>

        <p
          style={{
            color: "rgba(217,245,240,0.6)",
            marginBottom: "24px",
            lineHeight: 1.6,
            fontSize: "0.95rem",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          This conversation and all associated messages will be permanently removed.
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "15px",

              borderRadius: "16px",
              cursor: "pointer",

              background: "transparent",

              border: "1px solid rgba(117,226,224,0.18)",

              color: "#D9F5F0",

              fontSize: "0.92rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "15px",

              border: "none",
              borderRadius: "16px",

              cursor: "pointer",

              background:
                "linear-gradient(135deg, #C84A4A 0%, #8A2323 100%)",

              color: "#FFFFFF",

              fontSize: "0.92rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",

              boxShadow:
                "0 8px 24px rgba(200,74,74,0.25)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}