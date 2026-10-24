
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../auth/authService.js";
import "./Auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await registerUser(name, email, password);
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || "Unable to create your account.");
        } finally {
            setLoading(false);
        }
    }

    function goToLogin() {
        navigate("/login", {
            replace: true,
            state: {
                registered: true,
                email: email.trim(),
            },
        });
    }

    return (
        <main className="auth-page">
            <section className="auth-card">

                <h1>Create your account</h1>

                <p className="auth-subtitle">
                    Register to access your React programs.
                </p>

                <form onSubmit={handleRegister}>
                    <label htmlFor="name">Full Name</label>

                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                    />
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        type="text"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                    />
                    <label htmlFor="password">Password</label>

                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            aria-pressed={showPassword}
                        >
                            {showPassword ? "^" :  "v"}
                        </button>
                    </div>
                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}
                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </section>
            {showSuccess && (
                <div className="popup-overlay">
                    <section
                        className="popup-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="register-success-title"
                    >
                        <div className="popup-icon">✓</div>

                        <h2 id="register-success-title">
                            Account created!
                        </h2>

                        <p>
                            Your account has been created successfully.
                            You can now log in with your email and password.
                        </p>

                        <button
                            type="button"
                            onClick={goToLogin}
                        >
                            OK, Continue to Login
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
}

export default Register;
