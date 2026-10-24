import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import ReactRouterDemo from "./ReactRouterDemo";
import UserContext from "./context-api/UserContext";
import UserProfile from "./context-api/Userprofile";
import ErrorBoundary from "./ErrorBoundaries/ErrorBoundary";
import BuggyComponent from "./ErrorBoundaries/BuggyComponent";
import LazyLoadingDemo from "./LazyLoadingDemo";

function ContextDemo() {
  return (
    <UserContext.Provider value="Neha">
      <h2>Context API Example</h2>
      <UserProfile />
    </UserContext.Provider>
  );
}

function ErrorBoundaryDemo() {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
}

function LazyDemo() {
  return <LazyLoadingDemo />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/demos/router/*"
          element={<ReactRouterDemo />}
        />

        <Route
          path="/demos/context"
          element={<ContextDemo />}
        />

        <Route
          path="/demos/error-boundary"
          element={<ErrorBoundaryDemo />}
        />

        <Route
          path="/demos/lazy-loading"
          element={<LazyDemo />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;