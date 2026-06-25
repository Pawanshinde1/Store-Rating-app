import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCreateUser from './pages/admin/AdminCreateUser';
import AdminStores from './pages/admin/AdminStores';
import AdminCreateStore from './pages/admin/AdminCreateStore';
import UserStores from './pages/user/UserStores';
import UserRatings from './pages/user/UserRatings';
import StoreOwnerDashboard from './pages/owner/StoreOwnerDashboard';
import StoreOwnerRatings from './pages/owner/StoreOwnerRatings';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'USER', 'STORE_OWNER']}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminCreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminCreateStore />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/stores"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/ratings"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserRatings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/ratings"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <StoreOwnerRatings />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
