import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SubmitBugPage from "./pages/SubmitBugPage";
import ReportsPage from "./pages/ReportsPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit" element={<SubmitBugPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/:submissionId" element={<SubmissionDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
