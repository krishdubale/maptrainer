import { getTier } from "../hooks/useGameState";

export default function GameOver({
  totalScore,
  roundHistory,
  totalRounds,
  onPlayAgain,
  onHome,
}) {
  const avgScore = totalRounds > 0 ? Math.round(totalScore / totalRounds) : 0;
  const { tier, label, color } = getTier(avgScore);

  const best = roundHistory.reduce(
    (b, r, i) => (r.score > b.score ? { ...r, index: i } : b),
    { score: -1, index: 0 }
  );
  const worst = roundHistory.reduce(
    (w, r, i) => (r.score < w.score ? { ...r, index: i } : w),
    { score: 10000, index: 0 }
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        overflow: "auto",
      }}
    >
      <div className="animate-fade-in-up" style={{ maxWidth: 620, width: "100%" }}>
        {/* Tier */}
        <div className="animate-score-pop" style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            className={color}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "4.5rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {tier}
          </div>
          <div
            className={color}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            {label}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={labelStyle}>Total Score</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "var(--color-accent)",
              lineHeight: 1,
            }}
          >
            {totalScore}
            <span style={{ fontSize: "1rem", color: "var(--text-muted)", marginLeft: "6px" }}>
              / {totalRounds * 1000}
            </span>
          </div>
        </div>

        {/* Best / Worst */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <HighlightCard title="Best Round" name={best.location?.name || "—"} score={best.score >= 0 ? best.score : 0} accent="var(--color-accent)" />
          <HighlightCard title="Worst Round" name={worst.location?.name || "—"} score={worst.score <= 1000 ? worst.score : 0} accent="var(--color-danger)" />
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Location</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              {roundHistory.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: "left" }}>
                    {r.location?.name || "Unknown"}
                    {r.timedOut && <span style={{ marginLeft: "6px", fontSize: "0.65rem", color: "var(--color-danger)", fontWeight: 600 }}>TIMEOUT</span>}
                  </td>
                  <td style={tdStyle}>{r.distanceMeters !== null ? `${r.distanceMeters}m` : "—"}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: getScoreColor(r.score) }}>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={onPlayAgain} style={{ minWidth: 150 }}>Play Again</button>
          <button className="btn btn-secondary btn-lg" onClick={onHome} style={{ minWidth: 150 }}>Home</button>
        </div>
      </div>
    </div>
  );
}

function HighlightCard({ title, name, score, accent }) {
  return (
    <div className="card" style={{ padding: "12px 18px", textAlign: "center", minWidth: 140 }}>
      <div style={labelStyle}>{title}</div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: accent }}>{name}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{score} pts</div>
    </div>
  );
}

const labelStyle = {
  fontSize: "0.6rem",
  fontWeight: 600,
  color: "var(--text-muted)",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: "2px",
};

const thStyle = {
  padding: "8px 14px",
  textAlign: "center",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "8px 14px",
  textAlign: "center",
  color: "var(--text-secondary)",
  fontSize: "0.85rem",
};

function getScoreColor(score) {
  if (score >= 900) return "var(--color-accent)";
  if (score >= 700) return "var(--color-accent-light)";
  if (score >= 400) return "var(--color-warning)";
  return "var(--color-danger)";
}
