import { Route, Routes } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import { useThemeStore } from "./store/useThemeStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Homepage from "./pages/student/Homepage";
import Layout from "./components/student/Layout";
import useAuthUser from "./hooks/useAuthUser";
import PageLoader from "./components/PageLoader";

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;
  const isAuthenticated = Boolean(authUser);
  const isAdmin = authUser?.role === "Admin";

  return (
    <div className="h-screen w-full overflow-hidden" data-theme={theme}>
      <Routes>
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Dashboard />
              ) : (
                <Homepage />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout showSidebar={true}>
                <Homepage />
              </Layout>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
