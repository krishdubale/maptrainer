import { useEffect, useState } from "react";
import MapView from "./MapView";

const IMAGE_SIZE = 8192;

export default function RoundResult({
  roundResult,
  guessPosition,
  currentLocation,
  onNext,
  isLastRound,
}) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!roundResult) return;
    const target = roundResult.score;
    if (target === 0) { setDisplayScore(0); return; }

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 35));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      setDisplayScore(current);
    }, 25);

    return () => clearInterval(interval);
  }, [roundResult]);

  if (!roundResult) return null;

  const actualLat = currentLocation.y * IMAGE_SIZE;
  const actualLng = currentLocation.x * IMAGE_SIZE;
  const actualPos = [actualLat, actualLng];
  const scorePercent = Math.round((roundResult.score / 1000) * 100);

  let scoreColor = "var(--color-danger)";
  if (roundResult.score >= 900) scoreColor = "var(--color-success)";
  else if (roundResult.score >= 700) scoreColor = "var(--color-accent)";
  else if (roundResult.score >= 400) scoreColor = "var(--color-warning)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.95)",
      }}
    >
      {/* Map showing both markers */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapView
          guessPosition={guessPosition}
          actualPosition={actualPos}
          showResult={true}
          onMapClick={() => {}}
          disabled={true}
        />
      </div>

      {/* Result bar */}
      <div
        className="animate-fade-in-up"
        style={{
          padding: "18px 28px",
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Location */}
        <div>
          <div style={labelStyle}>LOCATION</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 600,
              letterSpacing: "1px",
              color: "var(--text-primary)",
            }}
          >
            {currentLocation.name}
          </div>
          {currentLocation.hint && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1px" }}>
              {currentLocation.hint}
            </div>
          )}
        </div>

        {/* Score */}
        <div style={{ textAlign: "center" }}>
          {roundResult.timedOut ? (
            <div
              className="animate-score-pop"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "var(--color-danger)",
                letterSpacing: "1px",
              }}
            >
              TIME'S UP
            </div>
          ) : (
            <>
              <div
                className="animate-score-pop"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {displayScore}
              </div>
              <div style={{ ...labelStyle, marginTop: "2px" }}>POINTS</div>
            </>
          )}
          <div
            style={{
              width: 160,
              height: 4,
              background: "var(--border-color)",
              borderRadius: 2,
              marginTop: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${scorePercent}%`,
                height: "100%",
                background: scoreColor,
                borderRadius: 2,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        {/* Distance */}
        <div style={{ textAlign: "center" }}>
          <div style={labelStyle}>DISTANCE</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {roundResult.distanceMeters !== null ? `${roundResult.distanceMeters}m` : "—"}
          </div>
        </div>

        {/* Next */}
        <button className="btn btn-primary btn-lg" onClick={onNext} style={{ minWidth: 150 }}>
          {isLastRound ? "See Results" : "Next →"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "0.65rem",
  fontWeight: 500,
  color: "var(--text-muted)",
  letterSpacing: "2px",
  textTransform: "uppercase",
};
