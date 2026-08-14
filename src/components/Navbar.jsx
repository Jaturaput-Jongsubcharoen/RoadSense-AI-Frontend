//ORIGINAL CODE (WORKING)

// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="navbar">
//       <h2 className="brand">AsphaltAegis</h2>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/detect">Detect Damage</Link></li>
//         <li><Link to="/chat">AI Chatbot</Link></li>
//       </ul>
//     </nav>
//   );
// }


import { Link } from "react-router-dom";

export default function Navbar({ navigationOpen, onNavigate, onToggle }) {
  return (
    <nav className={`navbar-container ${navigationOpen ? "is-open" : ""}`}>
      <div className="navbar-header">
        <Link to="/" className="navbar-brand" onClick={onNavigate}>
          <span className="brand-mark" aria-hidden="true">RS</span>
          <span>RoadSense AI</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={navigationOpen}
          aria-controls="primary-navigation"
          aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
          onClick={onToggle}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <ul id="primary-navigation" className="navbar-links">
        <li><Link to="/" onClick={onNavigate}>Overview <span>01</span></Link></li>
        <li><Link to="/detect" onClick={onNavigate}>Detect Damage <span>02</span></Link></li>
        <li><Link to="/chat" onClick={onNavigate}>AI Assistant <span>03</span></Link></li>
      </ul>
      <div className="navbar-footer"><span className="status-dot" /> Local-first intelligence</div>
    </nav>
  );
}

