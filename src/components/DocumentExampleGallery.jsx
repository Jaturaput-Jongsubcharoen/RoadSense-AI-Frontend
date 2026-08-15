import { useEffect, useRef, useState } from "react";
import { API_URL } from "../services/config";

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentExampleGallery({ onUseDocument }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/examples/documents`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Example documents could not be loaded.");
        return data.documents || [];
      })
      .then((items) => { if (active) setDocuments(items); })
      .catch((requestError) => {
        console.error("Example document listing failed:", requestError);
        if (active) setError("Example documents are unavailable. The Flask backend must be running.");
      })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion || documents.length < 2) return undefined;
    const interval = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      carousel.scrollLeft = carousel.scrollLeft + 1 >= maxScroll ? 0 : carousel.scrollLeft + 1;
    }, 45);
    return () => window.clearInterval(interval);
  }, [documents.length, paused]);

  useEffect(() => {
    if (!preview) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setPreview(null); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [preview]);

  const handleUseDocument = async (document) => {
    try {
      const response = await fetch(`${API_URL}${document.url}`);
      if (!response.ok) throw new Error("Example document download failed.");
      const blob = await response.blob();
      onUseDocument(document, new File([blob], document.filename, { type: blob.type || "application/pdf" }));
    } catch (requestError) {
      console.error("Example document selection failed:", requestError);
      setError("This example could not be selected. Check the backend connection.");
    }
  };

  return (
    <section className="document-gallery" aria-labelledby="document-examples-title">
      <div className="gallery-heading">
        <div>
          <span className="panel-label">BUNDLED REFERENCE DOCUMENTS</span>
          <h2 id="document-examples-title">Start with a real report.</h2>
        </div>
        <p>Preview a first page, then send the selected document through the same RAG indexing flow as a manual upload.</p>
      </div>
      {isLoading && <div className="document-carousel document-skeleton-carousel" role="status" aria-label="Loading reference documents">{Array.from({ length: 3 }, (_, index) => <div className="document-skeleton" key={index}><span /><div /><div /><b /></div>)}</div>}
      {error && <p className="status-message status-error" role="alert">{error}</p>}
      {!isLoading && !error && (
        <div className="document-carousel" ref={carouselRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} tabIndex={0} aria-label="Example document carousel">
          {documents.map((document) => (
            <article className="document-card" key={document.filename}>
              <button type="button" className="pdf-cover" onClick={() => setPreview(document)} aria-label={`Preview ${document.title}`}>
                <iframe src={`${API_URL}${document.url}#page=1&toolbar=0&navpanes=0`} title={`${document.title} first page`} tabIndex="-1" />
              </button>
              <div className="document-card-body">
                <span className="example-label">{document.extension.toUpperCase()} · {formatBytes(document.size_bytes)}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <div className="document-actions"><button type="button" className="button button-secondary compact-button" onClick={() => setPreview(document)}>Preview</button><button type="button" className="button button-primary compact-button" onClick={() => handleUseDocument(document)}>Use for RAG</button></div>
              </div>
            </article>
          ))}
        </div>
      )}
      {preview && <div className="preview-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null); }}><div className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title"><div className="preview-header"><h2 id="preview-title">{preview.title}</h2><button type="button" className="preview-close" onClick={() => setPreview(null)} aria-label="Close document preview">×</button></div><iframe src={`${API_URL}${preview.url}#page=1`} title={`${preview.title} full preview`} /></div></div>}
    </section>
  );
}
