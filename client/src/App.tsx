import { Navigate, Route, Routes } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import { useThemeStore } from "./store/useThemeStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Homepage from "./pages/student/Homepage";
import Layout from "./components/student/Layout";
import useAuthUser from "./hooks/useAuthUser";
import PageLoader from "./components/PageLoader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./pages/admin/AdminLayout";
import MangeCourse from "./pages/admin/MangeCourse";
import ManageStudents from "./pages/admin/ManageStudents";

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;
  const isAuthenticated = Boolean(authUser);
  const isAdmin = authUser?.role == "Admin";

  return (
    <div className="h-screen w-full overflow-hidden" data-theme={theme}>
      <ToastContainer autoClose={3000} /> {/* ✅ container */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <AdminLayout showSidebar={true}>
                  <Dashboard />
                </AdminLayout>
              ) : (
                <Layout showSidebar={true}>
                  <Homepage />
                </Layout>
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route
          path="/course"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout showSidebar={true}>
                <MangeCourse />
              </AdminLayout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/"} />
            )
          }
        />
        <Route
          path="/students"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout showSidebar={true}>
                <ManageStudents />
              </AdminLayout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/"} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
