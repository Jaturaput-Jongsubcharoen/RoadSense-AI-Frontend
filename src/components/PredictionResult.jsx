// import { useLocation } from "react-router-dom";
// export default function PredictionResult() {
//   const { state } = useLocation();
//   const data = location.state || {};

//   return (
//     <div className="page">
//       <h1>Prediction Result</h1>
//       <p><strong>Class:</strong> {state.class_name}</p>
//       <p><strong>Confidence:</strong> {(state.confidence * 100).toFixed(2)}%</p>
//     </div>
//   );
// }



import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PredictionResult({ result = null, onClose = null }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const prediction = result || state;
  const close = onClose || (() => navigate("/detect"));

  useEffect(() => () => {
    if (prediction?.previewIsObjectUrl && prediction.imagePreview) URL.revokeObjectURL(prediction.imagePreview);
  }, [prediction]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [close]);

  if (!prediction) {
    return (
      <div className="result-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="result-dialog" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-header"><div className="eyebrow">RESULTS / WAITING FOR INPUT</div><button type="button" className="result-close" onClick={close} aria-label="Close prediction result">×</button></div>
          <h1 id="result-title">No prediction yet.</h1>
          <p>Choose a road image on the Detect Damage page first.</p>
          <button className="button button-primary" onClick={close}>Back to detection →</button>
        </div>
      </div>
    );
  }

  // --- 1️⃣ HANDLE BACKEND ERROR (like non-road images) ---
  if (prediction.error) {
    return (
      <div className="result-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="result-dialog" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-header"><div className="eyebrow">RESULTS / NEEDS ANOTHER IMAGE</div><button type="button" className="result-close" onClick={close} aria-label="Close prediction result">×</button></div>
          <h1 id="result-title">Analysis could not finish.</h1>
          <p className="result-error">{prediction.error}</p>
          <button className="button button-primary" onClick={close}>Try another image →</button>
        </div>
      </div>
    );
  }

  // Auto-detect correct field
  const className =
    prediction.class_name ||
    prediction.class ||
    prediction.label ||
    prediction.predicted_class ||
    "N/A";

  const confidence =
    prediction.confidence > 1
      ? prediction.confidence
      : (prediction.confidence * 100).toFixed(2);
  const hasExpectedClass = Boolean(prediction.expectedClass);
  const matchesExpected = hasExpectedClass && prediction.expectedClass === className;

  return (
    <div className="result-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="result-dialog" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className="result-header"><div className="eyebrow">RESULTS / MODEL OUTPUT</div><button type="button" className="result-close" onClick={close} aria-label="Close prediction result">×</button></div>
        <h1 id="result-title">Prediction result.</h1>
        {prediction.imagePreview && <div className="result-image-frame"><img className="result-image" src={prediction.imagePreview} alt="Analyzed road" /></div>}
        <div className="result-value"><span>Detected category</span><strong>{className}</strong></div>
        {hasExpectedClass && <div className={matchesExpected ? "comparison comparison-match" : "comparison comparison-mismatch"}><span>Expected class</span><strong>{prediction.expectedClass}</strong><p>{matchesExpected ? "✓ Prediction matches expected class" : "Prediction differs from expected class"}</p></div>}
        <p className="result-confidence"><strong>Confidence:</strong> {confidence}%</p>
        <button className="button button-secondary" onClick={close}>Close result</button>
      </div>
    </div>
  );
}
