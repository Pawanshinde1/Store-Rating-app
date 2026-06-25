import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { dashboardAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getStoreOwnerDashboard();
        setData(response.data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout title="Store Owner Dashboard">
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!data?.store) {
    return (
      <Layout title="Store Owner Dashboard">
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">
              No store assigned to your account yet. Contact an administrator.
            </Typography>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Store Owner Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {data.store.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {data.store.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.store.address}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rating Distribution
              </Typography>
              {data.ratingDistribution?.map((item) => (
                <Box key={item.star} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {item.star} <StarIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.totalRatings ? (item.count / data.totalRatings) * 100 : 0}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h2" fontWeight={700} color="primary">
                {data.averageRating}
              </Typography>
              <RatingStars value={data.averageRating} readOnly size="large" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on {data.totalRatings} ratings
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Ratings
              </Typography>
              {data.recentRatings?.length === 0 ? (
                <Typography color="text.secondary">No ratings yet</Typography>
              ) : (
                data.recentRatings?.map((rating, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < data.recentRatings.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {rating.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <RatingStars value={rating.rating} readOnly size="small" />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default StoreOwnerDashboard;
