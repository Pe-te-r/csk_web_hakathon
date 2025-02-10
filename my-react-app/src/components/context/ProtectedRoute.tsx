import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser();
  const location = useLocation(); // Get the current page the user is trying to visit

  if (!user) {
    // Redirect to login with `state` storing the attempted page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
