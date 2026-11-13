import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import UserForm from './pages/UserForm.jsx';
import Orders from './pages/Orders.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * Central routing table.
 * - /login            -> public login page
 * - /*                -> protected pages rendered inside the dashboard layout
 */
export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected routes (auth check lives in <ProtectedRoute />) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
