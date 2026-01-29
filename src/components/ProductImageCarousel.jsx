// src/components/ProductImageCarousel.jsx
import React, { useMemo, useState } from "react";
import clsx from "clsx";

const PLACEHOLDER = "/images/placeholder.jpg";

export default function ProductImageCarousel({
  images,
  alt,
  className = "",
  containerClassName = "",
}) {
  const slides = useMemo(() => {
    let arr = Array.isArray(images) ? images.filter(Boolean) : [];
    if (arr.length === 0) arr = [PLACEHOLDER];
    if (arr.length === 1) arr = [...arr, arr[0]];
    return arr;
  }, [images]);

  const [index, setIndex] = useState(0);

  const next = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    setIndex((i) => (i + 1) % slides.length);
  };

  const prev = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg",
        containerClassName
      )}
    >
      <img
        src={slides[index]}
        alt={alt}
        className={clsx("w-full object-cover", className)}
      />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute inset-y-0 left-1 flex items-center justify-center px-1
                       bg-black/20 hover:bg-black/30 text-white rounded-full my-auto h-8 w-8"
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute inset-y-0 right-1 flex items-center justify-center px-1
                       bg-black/20 hover:bg-black/30 text-white rounded-full my-auto h-8 w-8"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  i === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
