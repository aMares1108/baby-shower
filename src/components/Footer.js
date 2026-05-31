import React from "react";

function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>Te esperamos para celebrar la llegada de {name}.</p>
      </div>
    </footer>
  );
}

export default Footer;
