import React from "react";
import { useCountdown } from "../hooks/useCountdown";

function CountdownCard({ value, label }) {
  return (
    <div className="countdown__item">
      <span className="countdown__value">{String(value).padStart(2, "0")}</span>
      <span className="countdown__label">{label}</span>
    </div>
  );
}

function Countdown({ targetDate }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <section className="section" aria-labelledby="countdown-title">
      <div className="container">
        <h2 id="countdown-title">Falta muy poquito</h2>
        <div className="countdown" role="timer" aria-live="polite">
          <CountdownCard value={days} label="Dias" />
          <CountdownCard value={hours} label="Horas" />
          <CountdownCard value={minutes} label="Minutos" />
          <CountdownCard value={seconds} label="Segundos" />
        </div>
      </div>
    </section>
  );
}

export default Countdown;
