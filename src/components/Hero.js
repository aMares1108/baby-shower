import React from "react";

function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__content">
        <p className="kicker">Con mucho amor</p>
        <h1 className=" indie-flower-regular">{title}</h1>
        <p className="lead playwrite-au-vic-guides-regular">{subtitle}</p>
        <a href="#rsvp" className="button button--primary">
          Confirmar asistencia
        </a>
      </div>
    </header>
  );
}

export default Hero;
