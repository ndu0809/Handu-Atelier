import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const storedUser = localStorage.getItem("user");

  if (!isLoggedIn || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (!user?.id_user) {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Data user tidak valid:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;