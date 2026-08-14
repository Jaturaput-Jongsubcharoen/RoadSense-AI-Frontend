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



import { Link, useLocation } from "react-router-dom";

export default function PredictionResult() {
  const { state } = useLocation();

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

  return (
    <div className="page page-tool">
      <div className="tool-card result-card">
        <div className="eyebrow">RESULTS / MODEL OUTPUT</div>
        <h1>Prediction result.</h1>
        <div className="result-value"><span>Detected category</span><strong>{className}</strong></div>
        <p className="result-confidence"><strong>Confidence:</strong> {confidence}%</p>
        <Link className="button button-secondary" to="/detect">Analyze another image</Link>
      </div>
    </div>
  );
}
