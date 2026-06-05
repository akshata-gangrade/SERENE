export default function RegisterSuccessModal({ onContinue }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(2,18,28,0.72)",
        backdropFilter: "blur(12px)",
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
        }}
      >
        <div
          style={{
            color: "#75E2E0",
            fontSize: "0.72rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Welcome
        </div>

        <h2
          style={{
            color: "#D9F5F0",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem",
            fontWeight: 400,
            marginBottom: "14px",
          }}
        >
          Account Created
        </h2>

        <p
          style={{
            color: "rgba(217,245,240,0.6)",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Your SERENE account has been created successfully.
          You can now sign in and begin your wellness journey.
        </p>

        <button
          onClick={onContinue}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #2CACAD 0%, #024D60 100%)",
            color: "#D9F5F0",
          }}
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}