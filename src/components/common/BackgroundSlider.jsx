// src/components/common/BackgroundSlider.jsx
import React, { useEffect, useState, useRef } from "react";

/**
 * BackgroundSlider
 *
 * Props:
 * - images: array of public paths (e.g. ['/bg1.jpg','/bg2.jpg'])
 * - interval: ms between slides (default 8000)
 * - showControls: boolean, show arrows/dots (default false)
 * - pauseOnHover: boolean, pause auto-rotate when pointer over controls (default false)
 */
export default function BackgroundSlider({
  images = ["/snowy mountains.jpeg", "/green fields.jpg", "/tractor.jpg", "/flower mountains.jpg"],
  interval = 8000,
  showControls = false,
  pauseOnHover = false,
}) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(() => new Array(images.length).fill(false));
  const idxRef = useRef(index);
  idxRef.current = index;
  const timerRef = useRef(null);
  const isReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Preload images
  useEffect(() => {
    const imgs = images.map((src, i) => {
      const img = new Image();
      img.src = encodeURI(src);
      img.onload = () => setLoaded((prev) => {
        const copy = prev.slice();
        copy[i] = true;
        return copy;
      });
      return img;
    });

    return () => {
      imgs.forEach((img) => {
        // nothing special to cleanup for Image
      });
    };
  }, [images]);

  // Auto-rotate (respect reduced motion)
  useEffect(() => {
    if (isReducedMotion) return; // do not auto-rotate
    if (!images || images.length <= 1) return;

    function tick() {
      setIndex((i) => (i + 1) % images.length);
    }

    timerRef.current = setInterval(tick, interval);
    return () => clearInterval(timerRef.current);
  }, [images, interval, isReducedMotion]);

  // controls handlers (also safe if showControls==false)
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goTo = (i) => setIndex(i % images.length);

  // pause on hover logic for controls area
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!pauseOnHover) return;
    if (paused) {
      clearInterval(timerRef.current);
    } else {
      // restart timer
      if (!isReducedMotion && images.length > 1) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
      }
    }
    return () => {};
  }, [paused, pauseOnHover, images.length, interval, isReducedMotion]);

  return (
    <>
      {/* Background layer - behind UI */}
      <div className="fixed inset-0 -z-1 pointer-events-none select-none" aria-hidden>
        {images.map((rawSrc, i) => {
          const src = encodeURI(rawSrc);
          const isActive = i === index;
          return (
            <div
              key={i}
              className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url("${src}")`,
                // ensure the browser paints it even when pointer-events are none
                willChange: "opacity, transform",
              }}
            />
          );
        })}

        {/* subtle overlay to keep content legible */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* vignette for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/5 to-black/10" />
      </div>

      {/* Optional manual controls (placed above UI but pointer-events enabled) */}
      {showControls && (
        <div
          className="fixed bottom-6 right-6 z-30 flex items-center gap-3 pointer-events-auto"
          onMouseEnter={() => pauseOnHover && setPaused(true)}
          onMouseLeave={() => pauseOnHover && setPaused(false)}
        >
          <button
            type="button"
            aria-label="Previous background"
            onClick={goPrev}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow-md hover:bg-white transition"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl shadow-inner">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to background ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index ? "bg-white w-4 h-4" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next background"
            onClick={goNext}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow-md hover:bg-white transition"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
