import { useEffect, useMemo, useRef, useState } from "react";

const assets = import.meta.glob("../assets/examples/road/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});

const classLabels = {
  "broken-road-sign": "Broken Road Sign Issues",
  "damaged-road": "Damaged Road issues",
  "illegal-parking": "Illegal Parking Issues",
  littering: "Littering Garbage on Public Places Issues",
  "mixed-issues": "Mixed Issues",
  pothole: "Pothole Issues",
  vandalism: "Vandalism Issues",
};

const categories = [
  ["all", "All"],
  ["pothole", "Pothole"],
  ["damaged-road", "Damaged Road"],
  ["broken-road-sign", "Broken Sign"],
  ["illegal-parking", "Illegal Parking"],
  ["littering", "Littering"],
  ["mixed-issues", "Mixed Issues"],
  ["vandalism", "Vandalism"],
];

function buildExamples() {
  return Object.entries(assets).map(([path, url]) => {
    const parts = path.split("/");
    const slug = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    return { slug, filename, url, label: classLabels[slug] };
  });
}

export default function RoadExampleGallery({ onUseExample }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef(null);
  const dragState = useRef({ startX: 0, startScroll: 0 });
  const examples = useMemo(() => buildExamples(), []);
  const filteredExamples = selectedCategory === "all"
    ? examples
    : examples.filter((example) => example.slug === selectedCategory);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return undefined;

    const interval = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const nextScroll = carousel.scrollLeft + 1;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      carousel.scrollLeft = nextScroll >= maxScroll ? 0 : nextScroll;
    }, 45);

    return () => window.clearInterval(interval);
  }, [paused, selectedCategory]);

  const startDrag = (event) => {
    setDragging(true);
    setPaused(true);
    dragState.current = {
      startX: event.clientX,
      startScroll: carouselRef.current?.scrollLeft || 0,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!dragging || !carouselRef.current) return;
    carouselRef.current.scrollLeft = dragState.current.startScroll - (event.clientX - dragState.current.startX);
  };

  const endDrag = () => {
    setDragging(false);
    setPaused(false);
  };

  return (
    <section className="example-gallery" aria-labelledby="road-examples-title">
      <div className="gallery-heading">
        <div>
          <span className="panel-label">CURATED MODEL EXAMPLES</span>
          <h2 id="road-examples-title">Try a known road issue.</h2>
        </div>
        <p>21 images from the verified seven-class dataset. Choose one to send through the real prediction pipeline.</p>
      </div>
      <div className="category-filters" role="group" aria-label="Filter road examples">
        {categories.map(([slug, label]) => (
          <button key={slug} type="button" className={selectedCategory === slug ? "category-filter is-active" : "category-filter"} onClick={() => setSelectedCategory(slug)}>{label}</button>
        ))}
      </div>
      <div
        className={`example-carousel ${dragging ? "is-dragging" : ""}`}
        ref={carouselRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { if (!dragging) setPaused(false); }}
        onFocus={() => setPaused(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        tabIndex={0}
        aria-label="Road example carousel"
      >
        {filteredExamples.map((example) => (
          <article className="example-card" key={`${example.slug}-${example.filename}`}>
            <img src={example.url} alt={`${example.label} example`} draggable="false" />
            <div className="example-card-body">
              <span className="example-label">{example.label}</span>
              <p>Expected: <strong>{example.label}</strong></p>
              <button type="button" className="button button-primary compact-button" onClick={() => onUseExample(example)}>Use example</button>
            </div>
          </article>
        ))}
      </div>
      <p className="gallery-note">Hover or focus pauses movement. Scroll, swipe, or drag to browse manually. Reduced-motion preferences disable auto-scroll.</p>
    </section>
  );
}
