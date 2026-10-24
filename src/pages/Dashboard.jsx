import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { logoutUser } from "../auth/authService.js";
import { useState } from "react";
import "./Auth.css";

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
            "Load components only when needed to improve performance.",
        path: "/demos/lazy-loading",
    },
];

function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [logoutError, setLogoutError] = useState("");

    async function handleLogout() {
        setLogoutError("");

        try {
            await logoutUser();

            setUser(null);

            navigate("/login", {
                replace: true,
                state: { loggedOut: true },
            });
        } catch (error) {
            console.error("Logout failed:", error);

            setLogoutError(
                "We couldn't complete logout. Please try again."
            );
        }
    }

    // Display the name of the currently logged-in user.
    const displayName = user?.name || "User";

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <Link to="/dashboard" className="dashboard-brand">
                    <span className="dashboard-brand-mark">R</span>
                    React Programs
                </Link>

                <div className="dashboard-user">
                    <span>{displayName}</span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-welcome">
                    <p className="dashboard-label">
                        YOUR LEARNING SPACE
                    </p>

                    <h1>Welcome, {displayName}!</h1>

                    <p>
                        Choose a React program below and continue learning.
                    </p>
                </section>

                {logoutError && (
                    <div className="auth-error" role="alert">
                        {logoutError}
                    </div>
                )}

                <section>
                    <div className="dashboard-section-heading">
                        <h2>Your React Programs</h2>
                        <p>Four practical examples to explore.</p>
                    </div>

                    <div className="dashboard-grid">
                        {programs.map((program) => (
                            <article
                                className="dashboard-card"
                                key={program.path}
                            >
                                <span className="dashboard-card-number">
                                    {program.number} / 04
                                </span>

                                <h3>{program.title}</h3>

                                <p>{program.description}</p>

                                <Link to={program.path}>
                                    Open Program{" "}
                                    <span aria-hidden="true">→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <footer className="dashboard-footer">
                    Learn, explore, and practise React concepts.
                </footer>
            </main>
        </div>
    );
}

export default Dashboard;
