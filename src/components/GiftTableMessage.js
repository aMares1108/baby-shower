import React from "react";

function GiftTableMessage({ title, message, note, href, buttonLabel }) {
  return (
    <section className="section section--soft" aria-labelledby="gift-table-title">
      <div className="container gift-table">
        <p className="kicker">Detalle especial</p>
        <h2 id="gift-table-title">{title}</h2>
        <p className="lead gift-table__message">{message}</p>
        <p className="gift-table__note">{note}</p>
        {href ? (
          <a className="button button--primary gift-table__button" href={href} target="_blank" rel="noreferrer">
            {buttonLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default GiftTableMessage;