import { useEffect, useState } from 'react';
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
import { storeAPI, userAPI } from '../../api/services';
import {
  validateName,
  validateEmail,
  validateAddress,
  getErrorMessage,
} from '../../utils/validation';

const AdminCreateStore = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data } = await userAPI.getUsers({ role: 'STORE_OWNER', limit: 100 });
        setOwners(data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };
    fetchOwners();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (validateName(form.name)) newErrors.name = validateName(form.name);
    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validateAddress(form.address, true)) newErrors.address = validateAddress(form.address, true);
    if (!form.ownerId) newErrors.ownerId = 'Please select a store owner';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await storeAPI.createStore(form);
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Store">
      <Box sx={{ maxWidth: 600 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Create New Store
            </Typography>

            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" error={!!errors.ownerId}>
                <InputLabel>Store Owner</InputLabel>
                <Select
                  value={form.ownerId}
                  label="Store Owner"
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                >
                  {owners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </MenuItem>
                  ))}
                </Select>
                {errors.ownerId && (
                  <Typography variant="caption" color="error">{errors.ownerId}</Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Store Name (20-60 characters)"
                margin="normal"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                fullWidth
                label="Store Email"
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
                label="Store Address"
                margin="normal"
                required
                multiline
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Store'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/stores')}>
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

export default AdminCreateStore;
