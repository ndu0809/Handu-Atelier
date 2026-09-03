import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const storedUser = localStorage.getItem("user");

  if (!isLoggedIn || !storedUser) {
    return <Outlet />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user?.id_user) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  } catch (error) {
    console.error(
      "Data user tidak valid:",
      error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  }

  return <Outlet />;
}

export default GuestRoute;