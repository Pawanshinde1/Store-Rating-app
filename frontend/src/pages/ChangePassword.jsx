import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { authAPI } from '../api/services';
import { validatePassword, getErrorMessage } from '../utils/validation';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const passErr = validatePassword(form.newPassword);

    if (passErr) newErrors.newPassword = passErr;
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (form.currentPassword === form.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Change Password">
      <Box sx={{ maxWidth: 500 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Change Password
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Password must be 8-16 characters with at least one uppercase letter and one special character.
            </Alert>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                margin="normal"
                required
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
                required
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                margin="normal"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default ChangePassword;
