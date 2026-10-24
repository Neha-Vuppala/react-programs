import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../auth/authService.js";
import { useAuth } from "../auth/AuthContext.jsx";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { googleLoginUser } from "../auth/authService.js";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showLogoutMessage, setShowLogoutMessage] = useState(false);

const { setUser } = useAuth();
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
if (location.state?.email) {
setEmail(location.state.email);
}

setShowLogoutMessage(Boolean(location.state?.loggedOut));


}, [location.state]);

async function handleGoogleSuccess(googleResponse) {
    setError("");
    setLoading(true);

    try {
        const data = await googleLoginUser(googleResponse.credential);

        if (!data.user) {
            throw new Error("The server did not return the user details.");
        }

        setUser(data.user);

        navigate("/dashboard", {
            replace: true,
            state: null,
        });
    } catch (err) {
        setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
        setLoading(false);
    }
}

async function handleLogin(event) {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const data = await loginUser(email.trim(), password);

    if (!data.user) {
      throw new Error("Login failed. Please try again.");
    }

    setUser(data.user);

    navigate("/dashboard", {
      replace: true,
      state: null,
    });
  } catch (err) {
    console.error("Login error:", err.message);

    setError(err.message || "Unable to log in. Please try again.");
  } finally {
    setLoading(false);
  }
}


function closeLogoutMessage() {
setShowLogoutMessage(false);


navigate("/login", {
  replace: true,
  state: null,
});


}

return ( <main className="auth-page"> <section className="auth-card">

    <h1>Welcome back</h1>

    <p className="auth-subtitle">
      Sign in to access your React programs.
    </p>

    {location.state?.registered && (
      <p className="auth-success" role="status">
        Your account was created successfully. Please log in.
      </p>
    )}

    <form onSubmit={handleLogin}>
      <label htmlFor="email">Email address</label>

      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="password">Password</label>

      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? "^" : "v"}
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
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>

    <div className="auth-divider">OR</div>

   <div className="google-login-container">
    <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
            setError("Google sign-in was unsuccessful. Please try again.");
        }}
        text="continue_with"
        shape="rectangular"
        theme="outline"
        size="large"
        width="320"
    />
</div>

    <p className="auth-footer">
      Don't have an account? <Link to="/register">Create account</Link>
    </p>
  </section>

  {showLogoutMessage && (
    <div className="popup-overlay">
      <section
        className="popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <div className="popup-icon logout-icon">✓</div>

        <h2 id="logout-title">You've been logged out</h2>

        <p>
          Your session has ended successfully.
          Please log in again to access your React programs.
        </p>

        <button type="button" onClick={closeLogoutMessage}>
          OK
        </button>
      </section>
    </div>
  )}
</main>

);
}

export default Login;
