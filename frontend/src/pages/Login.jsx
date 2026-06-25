import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      const redirectMap = {
        ADMIN: '/admin/dashboard',
        USER: '/user/stores',
        STORE_OWNER: '/owner/dashboard',
      };
      navigate(redirectMap[user.role] || '/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (user) return <LoadingSpinner fullScreen message="Redirecting..." />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(form);
      const redirectMap = {
        ADMIN: '/admin/dashboard',
        USER: '/user/stores',
        STORE_OWNER: '/owner/dashboard',
      };
      navigate(redirectMap[loggedInUser.role]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <StorefrontIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700}>
                Store Rating
              </Typography>
              <Typography color="text.secondary">Sign in to your account</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Typography textAlign="center">
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
