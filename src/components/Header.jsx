export default function Header({ phase, totalScore, currentRound, totalRounds, onHome }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 52,
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-color)",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: phase !== "home" ? "pointer" : "default",
          userSelect: "none",
        }}
        onClick={phase !== "home" ? onHome : undefined}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-sm)",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          MT
        </div>
        <div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            Map Trainer
          </div>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            BGMI · Erangel
          </div>
        </div>
      </div>

      {/* Game HUD */}
      {(phase === "playing" || phase === "result") && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <HudStat label="Round" value={`${currentRound + 1}/${totalRounds}`} />
          <div style={{ width: 1, height: 24, background: "var(--border-color)" }} />
          <HudStat label="Score" value={totalScore} accent />
        </div>
      )}

      {/* Quit */}
      {(phase === "playing" || phase === "result") && (
        <button className="btn btn-sm btn-secondary" onClick={onHome}>
          ✕ Quit
        </button>
      )}

      {phase === "home" && <div />}
    </header>
  );
}

function HudStat({ label, value, accent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: accent ? "var(--color-accent)" : "var(--text-primary)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.5px",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
