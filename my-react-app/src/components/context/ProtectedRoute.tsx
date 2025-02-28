import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserProvider";
import SellerPageApplication from "../../pages/users/pages/SellerPageApplication";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string; // Optional prop to specify required role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useUser();
  const location = useLocation(); // Get the current page the user is trying to visit

  if (!user) {
    // Redirect to login with `state` storing the attempted page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'seller') {
      // Redirect to SellerApplication component if the required role is 'seller'
      return <SellerPageApplication />;
    }
    // Redirect to unauthorized page if user does not have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
