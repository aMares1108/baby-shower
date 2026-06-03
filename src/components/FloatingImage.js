import React from "react";

function FloatingImage({ src, alt }) {
  return (
    <div className="floating-image" aria-hidden="true">
      <img src={src} alt={alt} />
    </div>
  );
}

export default FloatingImage;
