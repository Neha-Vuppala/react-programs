import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function ReactRouterDemo() {
  return (
    <div>
      <h2>React Router Example</h2>

      <nav>
        <Link to="/demos/router">Home</Link>
        {" -- "}
        <Link to="/demos/router/about">About</Link>
        {" -- "}
        <Link to="/demos/router/contact">Contact</Link>
      </nav>

      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default ReactRouterDemo;