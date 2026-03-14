const modeDetails = {
  classic: {
    icon: "🎯",
    tagline: "Standard competitive — 5 rounds, 30 seconds each",
  },
  blitz: {
    icon: "⚡",
    tagline: "Think fast — 10 rounds, 10 seconds each",
  },
  practice: {
    icon: "📖",
    tagline: "No timer — learn every corner at your pace",
  },
};

export default function HomeScreen({ onStart, gameModes, onSettings }) {
  const bestScore = localStorage.getItem("bgmi_best_score") || "—";
  const gamesPlayed = localStorage.getItem("bgmi_games_played") || "0";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        overflow: "auto",
      }}
    >
      {/* Title */}
      <div
        className="animate-fade-in-up"
        style={{ textAlign: "center", marginBottom: "36px" }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "3px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          BGMI · Erangel
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "2px",
            lineHeight: 1,
            marginBottom: "10px",
          }}
        >
          Map Trainer
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: 380, margin: "0 auto", lineHeight: 1.5 }}>
          Master Erangel&apos;s drops, rotations, and callouts.
        </p>
      </div>

      {/* Global Stats */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "32px",
          animationDelay: "0.05s",
          animationFillMode: "backwards",
        }}
      >
        <StatBox label="Best Score" value={bestScore} accent />
        <div style={{ width: 1, height: 32, background: "var(--border-color)", alignSelf: "center" }} />
        <StatBox label="Games Played" value={gamesPlayed} />
      </div>

      {/* Mode Cards */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", maxWidth: 760 }}>
        {Object.entries(gameModes).map(([key, config], index) => {
          const d = modeDetails[key];
          const modeBest = localStorage.getItem(`bgmi_best_${key}`);
          return (
            <div
              key={key}
              className="card animate-fade-in-up"
              style={{
                width: 228,
                cursor: "pointer",
                textAlign: "center",
                padding: "28px 20px 20px",
                animationDelay: `${0.08 + index * 0.06}s`,
                animationFillMode: "backwards",
              }}
              onClick={() => onStart(key)}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{d.icon}</div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                {config.name}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "14px" }}>
                {d.tagline}
              </p>
              {/* Per-mode best */}
              <div
                style={{
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-color)",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                }}
              >
                Best:{" "}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: modeBest ? "var(--color-accent)" : "var(--text-muted)",
                  }}
                >
                  {modeBest || "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="animate-fade-in"
        style={{
          marginTop: "28px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          animationDelay: "0.3s",
          animationFillMode: "backwards",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Select a mode to begin · ESC to quit during game
        </p>
        <button
          className="btn btn-sm btn-secondary"
          onClick={onSettings}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙ Settings
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.6rem",
          fontWeight: 600,
          color: accent ? "var(--color-accent)" : "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
