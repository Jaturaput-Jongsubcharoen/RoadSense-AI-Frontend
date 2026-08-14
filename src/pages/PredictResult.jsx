import { useLocation } from "react-router-dom";

export default function PredictResult() {
  const { state } = useLocation();

  if (!state) {
    return <h2>No prediction data received.</h2>;
  }

  return (
    <div className="page">
      <h1>Prediction Result</h1>

      <p><strong>Class:</strong> {state.class_name}</p>
      <p><strong>Confidence:</strong> {(state.confidence * 100).toFixed(2)}%</p>
    </div>
  );
}
