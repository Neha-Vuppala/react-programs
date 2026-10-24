import { lazy, Suspense, useState } from "react";
const Reports = lazy(() => import("./Reports"));

function LazyLoadingDemo() {
  const [showReports, setShowReports] = useState(false);

  return (
    <div>
      <h2>Lazy Loading Program</h2>

      <button onClick={() => setShowReports(true)}>
        View Reports
      </button>

      {showReports && (
        <Suspense fallback={<p>Loading reports...</p>}>
          <Reports />
        </Suspense>
      )}
    </div>
  );
}
export default LazyLoadingDemo;