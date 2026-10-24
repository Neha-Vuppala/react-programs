import { Link } from "react-router-dom";
import "./Landing.css";

const programs = [
  {
    number: "01",
    title: "React Router",
    description:
      "Learn how to navigate between pages without reloading the website.",
    path: "/demos/router",
  },
  {
    number: "02",
    title: "Context API",
    description:
      "Share data between components without passing props at every level.",
    path: "/demos/context",
  },
  {
    number: "03",
    title: "Error Boundaries",
    description:
      "Learn how to handle rendering errors and display fallback UI.",
    path: "/demos/error-boundary",
  },
  {
    number: "04",
    title: "Lazy Loading",
    description:
      "Load components only when they are needed to improve performance.",
    path: "/demos/lazy-loading",
  },
];

function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">R</span>
          <span>React Programs</span>
        </Link>

        <nav className="landing-nav-links">
          <a href="#programs">Programs</a>
          <Link to="/login" className="nav-login">
            Login
          </Link>
          <Link to="/register" className="nav-register">
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-content">
            <span className="hero-label">
              YOUR REACT LEARNING SPACE
            </span>

            <h1>
              Learn React.
              <br />
              <span>Build with confidence.</span>
            </h1>

            <p>
              Explore practical React examples, understand how each
              concept works, and improve your development skills
              one program at a time.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-button">
                Get Started <span>→</span>
              </Link>

              <Link to="/login" className="secondary-button">
                Login to Continue
              </Link>
            </div>

            <div className="hero-note">
              <span className="status-dot"></span>
              Four practical React programs to explore
            </div>
          </div>

          <div className="hero-card">
            <div className="code-window">
              <div className="code-window-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>App.jsx</span>
              </div>

              <div className="code-content">
                <p>
                  <span className="code-purple">function</span>{" "}
                  <span className="code-yellow">App</span>() {"{"}
                </p>
                <p className="code-indent">
                  <span className="code-purple">return</span> (
                </p>
                <p className="code-indent-2">
                  &lt;<span className="code-green">LearnReact</span> /&gt;
                </p>
                <p className="code-indent">);</p>
                <p>{"}"}</p>
              </div>

              <div className="code-window-footer">
                <span className="status-dot"></span>
                Ready to learn
              </div>
            </div>

            <div className="floating-card">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Learn by doing</strong>
                <p>Understand every concept</p>
              </div>
            </div>
          </div>
        </section>

        <section className="programs-section" id="programs">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE THE PROGRAMS</span>
              <h2>What would you like to learn?</h2>
            </div>

            <p>
              Choose a topic to explore its example and understand
              how it works.
            </p>
          </div>

          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" key={program.number}>
                <span className="program-number">{program.number}</span>

                <h3>{program.title}</h3>

                <p>{program.description}</p>

                <Link
                  to={program.path}
                  className="program-link"
                >
                  Explore program <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <div>
            <span className="section-label">READY TO GET STARTED?</span>
            <h2>Your next React concept starts here.</h2>
            <p>
              Create an account to access your learning dashboard.
            </p>
          </div>

          <Link to="/register" className="primary-button">
            Create Account <span>→</span>
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="brand footer-brand">
          <span className="brand-icon">R</span>
          <span>React Programs</span>
        </Link>

        <p>Learn, explore, and practise React concepts.</p>

        <span>© 2026 React Programs</span>
      </footer>
    </div>
  );
}

export default Landing;