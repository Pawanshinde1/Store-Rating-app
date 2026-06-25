import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getAdminDashboard();
        setData(response.data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout title="Admin Dashboard"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Admin Dashboard">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Users"
            value={data?.totalUsers || 0}
            icon={<PeopleIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Stores"
            value={data?.totalStores || 0}
            icon={<StoreIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Ratings"
            value={data?.totalRatings || 0}
            icon={<StarIcon fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users by Role
          </Typography>
          <Grid container spacing={2}>
            {['ADMIN', 'USER', 'STORE_OWNER'].map((role) => (
              <Grid item xs={12} sm={4} key={role}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {role.replace('_', ' ')}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {data?.roleBreakdown?.[role] || 0}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminDashboard;
