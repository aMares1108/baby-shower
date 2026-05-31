import React from "react";

function EventDetails({ dateLabel, timeLabel, place }) {
  return (
    <section className="section section--card">
      <div className="container details-grid">
        <article className="detail">
          <h2>Fecha</h2>
          <p>{dateLabel}</p>
        </article>
        <article className="detail">
          <h2>Hora</h2>
          <p>{timeLabel}</p>
        </article>
        <article className="detail">
          <h2>Lugar</h2>
          <p>{place}</p>
        </article>
      </div>
    </section>
  );
}

export default EventDetails;
