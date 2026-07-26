import React from "react";

function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__content">
        <p className="kicker">Con mucho amor</p>
        <h1 className="indie-flower-regular">{title}</h1>
        <p className="lead">{subtitle}</p>
        <div className="hero__actions">
          <a href="#rsvp" className="button button--primary">
            Confirmar asistencia
          </a>
          <a href="/detalles" className="button button--secondary">
            Ver detalles finales
          </a>
        </div>
      </div>
    </header>
  );
}

export default Hero;
