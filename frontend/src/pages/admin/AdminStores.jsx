import { useEffect, useState, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { storeAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await storeAPI.getStores({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      setStores(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(fetchStores, 300);
    return () => clearTimeout(timer);
  }, [fetchStores]);

  const columns = [
    { field: 'name', headerName: 'Store Name', sortable: true },
    { field: 'email', headerName: 'Email', sortable: true },
    { field: 'address', headerName: 'Address', sortable: true },
    {
      field: 'owner',
      headerName: 'Owner',
      render: (row) => row.owner?.name || 'N/A',
    },
    {
      field: 'averageRating',
      headerName: 'Avg Rating',
      sortable: false,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RatingStars value={row.averageRating} readOnly size="small" />
          <Typography variant="body2">
            {row.averageRating} ({row.totalRatings})
          </Typography>
        </Box>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Layout title="Manage Stores">
      {loading && stores.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={stores}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          search={search}
          searchPlaceholder="Search stores by name or address..."
          onPageChange={setPage}
          onLimitChange={(val) => { setLimit(val); setPage(1); }}
          onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
          onSearch={(val) => { setSearch(val); setPage(1); }}
        />
      )}
    </Layout>
  );
};

export default AdminStores;
