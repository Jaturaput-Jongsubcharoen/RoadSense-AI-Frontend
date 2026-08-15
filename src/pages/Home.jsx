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
import ProcessFlow from "../components/ProcessFlow";

export default function Home() {
  return (
    <div className="page page-home">
      <section className="hero-section">
        <div className="eyebrow">ROAD INTELLIGENCE / LOCAL AI</div>
        <h1>See the road<br /><em>more clearly.</em></h1>
        <p className="hero-copy">RoadSense AI helps explore road conditions in three ways: classify road images into seven issue categories, ask Normal Chat questions through a local Llama 3.1 assistant, and use Agentic RAG Knowledge to upload reports and receive answers grounded in their contents.</p>
      </section>

      <section className="feature-grid" aria-label="RoadSense AI capabilities">
        <article className="feature-card feature-card-dark">
          <span className="feature-number">01</span>
          <ProcessFlow type="classification" />
          <h2>Road issue<br />classification</h2>
          <p>Its purpose is to turn a road photo into a useful first assessment. RoadSense AI looks for visible issues such as potholes, damaged surfaces, broken signs, illegal parking, littering, mixed issues, and vandalism, helping you understand what may need attention before a closer inspection.</p>
          <Link to="/detect" className="button hero-cta hero-cta-primary">Analyze a road image <span aria-hidden="true">↗</span></Link>
        </article>
        <article className="feature-card feature-card-cream">
          <span className="feature-number">02</span>
          <ProcessFlow type="assistant" />
          <h2>Two ways to<br />ask better questions</h2>
          <p>Its purpose is to help you ask practical road-safety questions and understand reference material. Normal Chat supports open questions, while Agentic RAG Knowledge finds relevant passages in your PDF, TXT, DOC, or DOCX and uses them to keep answers connected to the document.</p>
          <Link to="/chat" className="button hero-cta hero-cta-secondary">Open AI assistant <span aria-hidden="true">↗</span></Link>
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
