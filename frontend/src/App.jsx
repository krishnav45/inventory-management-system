import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import PropTypes from "prop-types";
import Purchase from "./pages/Purchase";

// 🔐 Protected Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="Purchase" element={<Purchase />} />

        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;