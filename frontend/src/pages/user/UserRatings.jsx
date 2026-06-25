import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { ratingAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await ratingAPI.getUserRatings();
        setRatings(data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) {
    return (
      <Layout title="My Ratings">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout title="My Ratings">
      {ratings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">
              You haven&apos;t rated any stores yet. Browse stores to submit your first rating.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6">{rating.store.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rating.store.address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rated on {new Date(rating.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <RatingStars value={rating.rating} readOnly />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Layout>
  );
};

export default UserRatings;
