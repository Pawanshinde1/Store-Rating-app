import { useState } from 'react';
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
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  getErrorMessage,
} from '../utils/validation';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const addrErr = validateAddress(form.address);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (addrErr) newErrors.address = addrErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/user/stores');
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
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <StorefrontIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700}>
                Create Account
              </Typography>
              <Typography color="text.secondary">Register as a normal user</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name (20-60 characters)"
                margin="normal"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name || `${form.name.length}/60 characters`}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Address (optional, max 400 chars)"
                margin="normal"
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                fullWidth
                label="Password (8-16 chars, uppercase & special)"
                type="password"
                margin="normal"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </form>

            <Typography textAlign="center">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
