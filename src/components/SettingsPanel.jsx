/**
 * SettingsPanel — a lightweight modal for game preferences.
 * Currently exposes the sound-effects toggle.
 */
export default function SettingsPanel({ soundEnabled, onToggleSound, onClose }) {
  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="card animate-fade-in-up"
        style={{ width: "100%", maxWidth: 360, padding: "28px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "1px",
              color: "var(--text-primary)",
            }}
          >
            Settings
          </h2>
          <button
            className="btn btn-sm btn-secondary"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Sound toggle row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Sound Effects
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                marginTop: "1px",
              }}
            >
              Clicks, confirms, and score jingles
            </div>
          </div>
          <button
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              border: "none",
              cursor: "pointer",
              background: soundEnabled ? "var(--color-accent)" : "var(--border-color)",
              position: "relative",
              transition: "background var(--transition-base)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: soundEnabled ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left var(--transition-base)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              }}
            />
          </button>
        </div>

        {/* Keyboard shortcuts reference */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Keyboard Shortcuts
          </div>
          {[
            ["Enter / Space", "Confirm guess / Next round"],
            ["Escape", "Quit to home"],
          ].map(([key, desc]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
              }}
            >
              <kbd
                style={{
                  padding: "3px 8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                }}
              >
                {key}
              </kbd>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {desc}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ width: "100%", marginTop: "24px" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
