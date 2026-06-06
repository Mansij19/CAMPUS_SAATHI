import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import FormAnalysisPage from "./pages/FormAnalysisPage.jsx";
import FormAssistantPage from "./pages/FormAssistantPage.jsx";
import FormUploadPage from "./pages/FormUploadPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NoticeHistoryPage from "./pages/NoticeHistoryPage.jsx";
import NoticeSummarizerPage from "./pages/NoticeSummarizerPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <FormAssistantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/upload"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <FormUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <FormAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <NoticeSummarizerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices/history"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <NoticeHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
