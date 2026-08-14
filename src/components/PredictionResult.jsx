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



import { useLocation } from "react-router-dom";

export default function PredictionResult() {
  const { state } = useLocation();

  if (!state) return <h2>No prediction data received.</h2>;

  // --- 1️⃣ HANDLE BACKEND ERROR (like non-road images) ---
  if (state.error) {
    return (
      <div className="page">
        <h1>Prediction Result</h1>
        <p style={{ color: "red", fontSize: "20px" }}>
          <strong>Error:</strong> {state.error}
        </p>
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
    <div className="page-center">
      <div className="card">
      <h1>Prediction Result</h1>

      <p><strong>Class:</strong> {className}</p>
      <p><strong>Confidence:</strong> {confidence}%</p>
    </div>
    </div>
  );
}
