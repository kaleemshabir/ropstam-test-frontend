import { useLocation, Navigate } from "react-router-dom";
export default function PublicRoute({ isLoggedIn, children }) {
  const location = useLocation();

  if (isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
