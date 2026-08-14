// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="page">
//       <h1>Road Damage Detection System</h1>
//       <p>Upload an image of a road to detect issues using our AI model.</p>
//     </div>
//   );
// }


import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page page-home">
      <section className="hero-section">
        <div className="eyebrow">ROAD INTELLIGENCE / LOCAL AI</div>
        <h1>See the road<br /><em>more clearly.</em></h1>
        <p className="hero-copy">RoadSense AI pairs computer vision with a local AI assistant to turn road images and reference documents into useful, explainable starting points.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/detect">Analyze a road image <span aria-hidden="true">→</span></Link>
          <Link className="button button-secondary" to="/chat">Open AI assistant <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="feature-grid" aria-label="RoadSense AI capabilities">
        <article className="feature-card feature-card-dark">
          <span className="feature-number">01</span>
          <h2>Road issue<br />classification</h2>
          <p>Upload a JPG, PNG, or WebP road image. The Flask API sends it through the trained EfficientNetB0 model and returns one of seven issue categories.</p>
          <Link to="/detect" className="text-link">Try detection <span>↗</span></Link>
        </article>
        <article className="feature-card feature-card-cream">
          <span className="feature-number">02</span>
          <h2>Two ways to<br />ask better questions</h2>
          <p>Use Normal Chat for a local Llama 3.1 conversation, or upload a PDF, TXT, DOC, or DOCX for grounded RAG answers.</p>
          <Link to="/chat" className="text-link">Explore assistant <span>↗</span></Link>
        </article>
      </section>

      <section className="workflow-strip">
        <div>
          <span className="eyebrow">HOW IT CONNECTS</span>
          <h2>One interface.<br />Three local services.</h2>
        </div>
        <ol className="workflow-list">
          <li><span>01</span><strong>React</strong><small>Choose an image or question</small></li>
          <li><span>02</span><strong>Flask API</strong><small>Routes each request safely</small></li>
          <li><span>03</span><strong>AI services</strong><small>Model, retrieval, or Llama 3.1</small></li>
        </ol>
      </section>
    </div>
  );
}
