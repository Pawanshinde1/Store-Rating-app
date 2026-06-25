import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { userAPI } from '../../api/services';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  getErrorMessage,
} from '../../utils/validation';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (validateName(form.name)) newErrors.name = validateName(form.name);
    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validatePassword(form.password)) newErrors.password = validatePassword(form.password);
    if (validateAddress(form.address)) newErrors.address = validateAddress(form.address);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await userAPI.createUser(form);
      toast.success(`${form.role} created successfully`);
      navigate('/admin/users');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create User">
      <Box sx={{ maxWidth: 600 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Create New User
            </Typography>

            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={form.role}
                  label="Role"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Full Name (20-60 characters)"
                margin="normal"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
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
                label="Address (optional)"
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
                label="Password"
                type="password"
                margin="normal"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/users')}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default AdminCreateUser;
