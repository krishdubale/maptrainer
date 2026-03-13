import { useEffect, useRef } from "react";

export default function Timer({ timeLeft, maxTime }) {
  const canvasRef = useRef(null);
  const isUrgent = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 64;
    const lineWidth = 3;
    const radius = (size - lineWidth) / 2;
    const center = size / 2;

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#e5e0d5";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress ring
    const progress = timeLeft / maxTime;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * progress;

    let color;
    if (isCritical) color = "#c0392b";
    else if (isUrgent) color = "#e09f3e";
    else color = "#2d6a4f";

    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  }, [timeLeft, maxTime, isUrgent, isCritical]);

  if (maxTime === null || maxTime === undefined) return null;

  return (
    <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
      <span
        className={isCritical ? "animate-pulse" : ""}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          fontWeight: 600,
          color: isCritical ? "var(--color-danger)" : isUrgent ? "var(--color-warning)" : "var(--text-primary)",
          zIndex: 1,
        }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
