import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = getAuth();
  const [userRole, setUserRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserRole(null);
      } else {
        const storedRole = localStorage.getItem("userRole");
        setUserRole(storedRole);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
export default ProtectedRoute