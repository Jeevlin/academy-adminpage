import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin";
import SuperAdminDashboard from "./pages/superadmin";
import ProtectedRoute from "./protectedRoute";
import Register from "./pages/form";

function App() {
  

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
  
      </Routes>
    </Router>
  );
}

export default App;
