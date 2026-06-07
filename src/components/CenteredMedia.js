import React from "react";

function CenteredMedia({
  type = "image",
  src,
  alt = "",
  caption,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false
}) {
  if (!src) {
    return null;
  }

  return (
    <section className="section">
      <div className="container media-center">
        <figure className="media-center__figure">
          {type === "video" ? (
            <video
              className="media-center__video"
              src={src}
              poster={poster}
              controls={controls}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline
            />
          ) : (
            <img className="media-center__image" src={src} alt={alt} loading="lazy" />
          )}
          {caption ? <figcaption className="media-center__caption">{caption}</figcaption> : null}
        </figure>
      </div>
    </section>
  );
}

export default CenteredMedia;
