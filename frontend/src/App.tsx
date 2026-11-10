```tsx
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SubmitBugPage from "./pages/SubmitBugPage";
import BugReportsPage from "./pages/BugReportsPage";
import BugDetailsPage from "./pages/BugDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/submit"
            element={<SubmitBugPage />}
          />

          <Route
            path="/reports"
            element={<BugReportsPage />}
          />

          <Route
            path="/reports/:submissionId"
            element={<BugDetailsPage />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
