import { useEffect, useRef, useState } from "react";
import { API_URL } from "../services/config";

const categories = [
  ["all", "All"],
  ["Pothole Issues", "Pothole"],
  ["Damaged Road issues", "Damaged Road"],
  ["Broken Road Sign Issues", "Broken Sign"],
  ["Illegal Parking Issues", "Illegal Parking"],
  ["Littering Garbage on Public Places Issues", "Littering"],
  ["Mixed Issues", "Mixed Issues"],
  ["Vandalism Issues", "Vandalism"],
];

export default function RoadExampleGallery({ onUseExample }) {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef(null);
  const dragState = useRef({ startX: 0, startScroll: 0 });

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/examples/images`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Example images could not be loaded.");
        return data.images || [];
      })
      .then((items) => { if (active) setImages(items); })
      .catch((requestError) => {
        console.error("Example image listing failed:", requestError);
        if (active) setError("Example images are unavailable. Start the Flask backend to browse them.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter((image) => image.expectedClass === selectedCategory);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const carousel = carouselRef.current;
    if (paused || reducedMotion || !carousel || carousel.scrollWidth <= carousel.clientWidth) return undefined;
    const interval = window.setInterval(() => {
      const current = carouselRef.current;
      if (!current || current.scrollWidth <= current.clientWidth) return;
      const next = current.scrollLeft + 1;
      current.scrollLeft = next >= current.scrollWidth - current.clientWidth ? 0 : next;
    }, 45);
    return () => window.clearInterval(interval);
  }, [filteredImages.length, paused]);

  const startDrag = (event) => {
    setDragging(true);
    setPaused(true);
    dragState.current = { startX: event.clientX, startScroll: carouselRef.current?.scrollLeft || 0 };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveDrag = (event) => {
    if (dragging && carouselRef.current) carouselRef.current.scrollLeft = dragState.current.startScroll - (event.clientX - dragState.current.startX);
  };
  const endDrag = () => { setDragging(false); setPaused(false); };

  const handleUseExample = async (image) => {
    setSelectedId(image.id);
    setError("");
    try {
      const response = await fetch(`${API_URL}${image.url}`);
      if (!response.ok) throw new Error("Example image could not be loaded.");
      const blob = await response.blob();
      onUseExample({ ...image, url: `${API_URL}${image.url}`, file: new File([blob], image.filename, { type: blob.type || "image/jpeg" }) });
      setPaused(true);
    } catch (requestError) {
      console.error("Example image selection failed:", requestError);
      setSelectedId("");
      setError("This example image could not be selected. Check the backend connection.");
    }
  };

  return (
    <section className="example-gallery" aria-labelledby="road-examples-title">
      <div className="gallery-heading"><div><span className="panel-label">TRY A KNOWN ROAD ISSUE</span><h2 id="road-examples-title">Choose a real model example.</h2></div><p>Backend-owned examples are discovered automatically. Use one to run the same prediction flow as a manual image.</p></div>
      <div className="category-filters" role="group" aria-label="Filter road examples">
        {categories.map(([value, label]) => <button key={value} type="button" className={selectedCategory === value ? "category-filter is-active" : "category-filter"} onClick={() => setSelectedCategory(value)}>{label}</button>)}
      </div>
      {isLoading && <div className="example-carousel example-skeleton-carousel" role="status" aria-label="Loading road examples">{Array.from({ length: 4 }, (_, index) => <div className="example-skeleton" key={index}><span /><div /><div /><b /></div>)}</div>}
      {error && <p className="status-message status-error" role="alert">{error}</p>}
      {!isLoading && !error && <div className={`example-carousel ${dragging ? "is-dragging" : ""}`} ref={carouselRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => { if (!dragging) setPaused(false); }} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} tabIndex={0} aria-label="Road example carousel">
        {filteredImages.map((image, index) => <article className="example-card" key={image.id}><img src={`${API_URL}${image.url}`} alt={`${image.expectedClass} example`} loading={index < 4 ? "eager" : "lazy"} decoding="async" draggable="false" /><div className="example-card-body"><span className="example-label">{image.category}</span><p>Expected result: <strong>{image.expectedClass}</strong></p><button type="button" className="button button-primary compact-button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); handleUseExample(image); }} disabled={selectedId === image.id}> {selectedId === image.id ? "Selecting…" : "Use example"}</button></div></article>)}
      </div>}
      <p className="gallery-note">Hover or focus pauses movement. Scroll, swipe, or drag to browse. Reduced motion disables auto-scroll.</p>
    </section>
  );
}
