// ORIGINAL CODE WORKING
// import { useState } from "react";
// import ImageUploader from "../components/ImageUploader";

// export default function Detect() {
//   return (
//     <div>
//       <ImageUploader />
//     </div>
//   );
// }

import ImageUploader from "../components/ImageUploader";
import { useState } from "react";
import RoadExampleGallery from "../components/RoadExampleGallery";
import PredictionResult from "../components/PredictionResult";

export default function Detect() {
  const [exampleFile, setExampleFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="page page-tool">
      <section className="page-intro">
        <div className="eyebrow">02 / COMPUTER VISION</div>
        <h1>Detect road damage.</h1>
        <p>Give the classifier one clear road image. It returns a likely issue category and confidence score to help you decide what to inspect next.</p>
      </section>
      <RoadExampleGallery onUseExample={setExampleFile} />
      <div className="tool-layout">
        <aside className="how-panel">
          <span className="panel-label">HOW IT WORKS</span>
          <ol className="step-list">
            <li><span>1</span><div><strong>Choose an image</strong><small>JPG, PNG, or WebP</small></div></li>
            <li><span>2</span><div><strong>Submit for analysis</strong><small>React sends `/api/predict`</small></div></li>
            <li><span>3</span><div><strong>Review the result</strong><small>EfficientNetB0 returns a class</small></div></li>
          </ol>
          <p className="technical-note">Technical note: Flask resizes the image to 224 × 224 before TensorFlow inference.</p>
        </aside>
        <div className="tool-card"><ImageUploader key={exampleFile?.id || "manual"} exampleFile={exampleFile} onPrediction={setPrediction} /></div>
      </div>
      {prediction && <PredictionResult result={prediction} onClose={() => setPrediction(null)} />}
    </div>
  );
}
