import MapView from "./MapView";
import Timer from "./Timer";

export default function GameScreen({
  currentLocation,
  currentRound,
  totalRounds,
  timeLeft,
  maxTime,
  guessPosition,
  confirmed,
  onMapClick,
  onConfirm,
}) {
  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      {/* Left — Screenshot */}
      <div
        className="animate-fade-in"
        style={{
          width: "38%",
          minWidth: 280,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        {/* Image */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            overflow: "hidden",
          }}
        >
          <img
            src={currentLocation?.image}
            alt="Where is this?"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--shadow-lg)",
            }}
          />
        </div>

        {/* Bottom info */}
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div className="badge">Round {currentRound + 1}/{totalRounds}</div>
            {currentLocation?.zone && (
              <div className={`badge ${currentLocation.zone === "hot" ? "badge-red" : currentLocation.zone === "warm" ? "badge-orange" : "badge-green"}`}>
                {currentLocation.zone}
              </div>
            )}
          </div>
          {maxTime && <Timer timeLeft={timeLeft} maxTime={maxTime} />}
        </div>
      </div>

      {/* Right — Map */}
      <div className="animate-slide-in-right" style={{ flex: 1, position: "relative" }}>
        <MapView
          guessPosition={guessPosition}
          actualPosition={null}
          showResult={false}
          onMapClick={onMapClick}
          disabled={confirmed}
        />

        {/* Confirm overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {guessPosition && !confirmed && (
            <button
              className="btn btn-primary btn-lg animate-fade-in-up"
              onClick={onConfirm}
              style={{ minWidth: 180, boxShadow: "var(--shadow-lg)" }}
            >
              Confirm Guess
            </button>
          )}

          {!guessPosition && (
            <div
              className="animate-fade-in"
              style={{
                padding: "8px 16px",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Click on the map to place your guess
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
