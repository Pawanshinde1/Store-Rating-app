import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { storeAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const StoreOwnerRatings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeRes = await storeAPI.getOwnedStore();
        const ratingsRes = await storeAPI.getStoreRatings(storeRes.data.data.id);
        setData(ratingsRes.data.data);
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
      <Layout title="Store Ratings">
        <LoadingSpinner />
      </Layout>
    );
  }

  const columns = [
    { field: 'name', headerName: 'User Name', render: (row) => row.user.name },
    { field: 'email', headerName: 'Email', render: (row) => row.user.email },
    { field: 'address', headerName: 'Address', render: (row) => row.user.address || 'N/A' },
    {
      field: 'rating',
      headerName: 'Rating',
      render: (row) => <RatingStars value={row.rating} readOnly size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Layout title="Store Ratings">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          {data?.store?.name} - Ratings
        </Typography>
        <Typography color="text.secondary">
          Average: {data?.averageRating} | Total: {data?.totalRatings} ratings
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={data?.ratings || []}
        total={data?.ratings?.length || 0}
        emptyMessage="No users have rated your store yet"
      />
    </Layout>
  );
};

export default StoreOwnerRatings;
