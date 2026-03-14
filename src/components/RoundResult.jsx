import { useEffect, useState } from "react";

export default function RoundResult({
  roundResult,
  currentLocation,
  onNext,
  isLastRound,
}) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!roundResult) return;
    const target = roundResult.score;

    // Animate the counter from 0 to target
    let current = 0;
    const interval = setInterval(() => {
      current += Math.max(1, Math.ceil(target / 35));
      const next = Math.min(current, target);
      setDisplayScore(next);
      if (next >= target) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [roundResult]);

  if (!roundResult) return null;

  const scorePercent = Math.round((roundResult.score / 1000) * 100);

  let scoreColor = "var(--color-danger)";
  if (roundResult.score >= 900) scoreColor = "var(--color-success)";
  else if (roundResult.score >= 700) scoreColor = "var(--color-accent)";
  else if (roundResult.score >= 400) scoreColor = "var(--color-warning)";

  return (
    <div
      className="animate-fade-in-up"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        padding: "18px 28px",
        background: "var(--bg-primary)",
        borderTop: "2px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
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
            TIME&apos;S UP
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
