import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { storeAPI, ratingAPI } from '../../api/services';
import { getErrorMessage } from '../../utils/validation';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ratingDialog, setRatingDialog] = useState({ open: false, store: null, rating: 0 });

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

  const openRatingDialog = (store) => {
    setRatingDialog({
      open: true,
      store,
      rating: store.userRating?.rating || 0,
    });
  };

  const handleSubmitRating = async () => {
    const { store, rating } = ratingDialog;
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      if (store.userRating) {
        await ratingAPI.updateRating(store.id, rating);
        toast.success('Rating updated successfully');
      } else {
        await ratingAPI.submitRating({ storeId: store.id, rating });
        toast.success('Rating submitted successfully');
      }
      setRatingDialog({ open: false, store: null, rating: 0 });
      fetchStores();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns = [
    { field: 'name', headerName: 'Store Name', sortable: true },
    { field: 'address', headerName: 'Address', sortable: true },
    {
      field: 'averageRating',
      headerName: 'Avg Rating',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RatingStars value={row.averageRating} readOnly size="small" />
          <Typography variant="body2">{row.averageRating}</Typography>
        </Box>
      ),
    },
    {
      field: 'userRating',
      headerName: 'Your Rating',
      render: (row) =>
        row.userRating ? (
          <RatingStars value={row.userRating.rating} readOnly size="small" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not rated
          </Typography>
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      render: (row) => (
        <Button size="small" variant="outlined" onClick={() => openRatingDialog(row)}>
          {row.userRating ? 'Update Rating' : 'Rate Store'}
        </Button>
      ),
    },
  ];

  return (
    <Layout title="Browse Stores">
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
          searchPlaceholder="Search by store name or address..."
          onPageChange={setPage}
          onLimitChange={(val) => { setLimit(val); setPage(1); }}
          onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
          onSearch={(val) => { setSearch(val); setPage(1); }}
        />
      )}

      <Dialog
        open={ratingDialog.open}
        onClose={() => setRatingDialog({ open: false, store: null, rating: 0 })}
      >
        <DialogTitle>
          Rate {ratingDialog.store?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <RatingStars
              value={ratingDialog.rating}
              onChange={(val) => setRatingDialog({ ...ratingDialog, rating: val })}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog({ open: false, store: null, rating: 0 })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmitRating}>
            {ratingDialog.store?.userRating ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserStores;
