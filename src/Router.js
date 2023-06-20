import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import PublicRoute from "./helpers/publicRoute";
import Login from "./pages/Login";
import PrivateRoute from "./helpers/PrivateRoute";
import { AuthContext } from "./context/authContext";
import Categories from "./pages/Categories";
import Cars from "./pages/Cars";
import Register from "./pages/Register";

export default function Router() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route
            index
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="categories"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Categories />
              </PrivateRoute>
            }
          />
          <Route
            path="cars"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Cars />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<div>Route not found</div>} />
      </Routes>
    </>
  );
}
