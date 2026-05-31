import React from "react";

function Timeline({ items }) {
  return (
    <section className="section section--soft" aria-labelledby="timeline-title">
      <div className="container">
        <h2 id="timeline-title">Programa</h2>
        <ul className="timeline">
          {items.map((item) => (
            <li key={`${item.time}-${item.activity}`}>
              <strong>{item.time}</strong>
              {item.activity}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Timeline;
