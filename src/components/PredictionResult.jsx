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
import { Link, useLocation } from "react-router-dom";

export default function PredictionResult() {
  const { state } = useLocation();

  useEffect(() => () => {
    if (state?.previewIsObjectUrl && state.imagePreview) URL.revokeObjectURL(state.imagePreview);
  }, [state]);

  if (!state) {
    return (
      <div className="page page-tool">
        <div className="tool-card result-card">
          <div className="eyebrow">RESULTS / WAITING FOR INPUT</div>
          <h1>No prediction yet.</h1>
          <p>Choose a road image on the Detect Damage page first.</p>
          <Link className="button button-primary" to="/detect">Back to detection →</Link>
        </div>
      </div>
    );
  }

  // --- 1️⃣ HANDLE BACKEND ERROR (like non-road images) ---
  if (state.error) {
    return (
      <div className="page page-tool">
        <div className="tool-card result-card">
          <div className="eyebrow">RESULTS / NEEDS ANOTHER IMAGE</div>
          <h1>Analysis could not finish.</h1>
          <p className="result-error">{state.error}</p>
          <Link className="button button-primary" to="/detect">Try another image →</Link>
        </div>
      </div>
    );
  }

  // Auto-detect correct field
  const className =
    state.class_name ||
    state.class ||
    state.label ||
    state.predicted_class ||
    "N/A";

  const confidence =
    state.confidence > 1
      ? state.confidence
      : (state.confidence * 100).toFixed(2);
  const hasExpectedClass = Boolean(state.expectedClass);
  const matchesExpected = hasExpectedClass && state.expectedClass === className;

  return (
    <div className="page page-tool">
      <div className="tool-card result-card">
        <div className="eyebrow">RESULTS / MODEL OUTPUT</div>
        <h1>Prediction result.</h1>
        {state.imagePreview && <img className="result-image" src={state.imagePreview} alt="Analyzed road" />}
        <div className="result-value"><span>Detected category</span><strong>{className}</strong></div>
        {hasExpectedClass && <div className={matchesExpected ? "comparison comparison-match" : "comparison comparison-mismatch"}><span>Expected class</span><strong>{state.expectedClass}</strong><p>{matchesExpected ? "✓ Prediction matches expected class" : "Prediction differs from expected class"}</p></div>}
        <p className="result-confidence"><strong>Confidence:</strong> {confidence}%</p>
        <Link className="button button-secondary" to="/detect">Analyze another image</Link>
      </div>
    </div>
  );
}
