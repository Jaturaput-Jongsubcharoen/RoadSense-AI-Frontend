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

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <h2 className="navbar-brand">RoadSense AI</h2>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/detect">Detect Damage</Link></li>
        <li><Link to="/chat">AI Chatbot</Link></li>
      </ul>
    </nav>
  );
}

