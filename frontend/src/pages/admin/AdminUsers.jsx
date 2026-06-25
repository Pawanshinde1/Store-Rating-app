import { useEffect, useState, useCallback } from 'react';
import { Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/validation';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getUsers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        role: roleFilter || undefined,
      });
      setUsers(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const columns = [
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'email', headerName: 'Email', sortable: true },
    {
      field: 'role',
      headerName: 'Role',
      sortable: true,
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          color={row.role === 'ADMIN' ? 'error' : row.role === 'STORE_OWNER' ? 'warning' : 'primary'}
        />
      ),
    },
    { field: 'address', headerName: 'Address' },
    {
      field: 'createdAt',
      headerName: 'Created',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Layout title="Manage Users">
      {loading && users.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          search={search}
          searchPlaceholder="Search users by name, email, address..."
          onPageChange={setPage}
          onLimitChange={(val) => { setLimit(val); setPage(1); }}
          onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
          onSearch={(val) => { setSearch(val); setPage(1); }}
          filters={
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              </Select>
            </FormControl>
          }
        />
      )}
    </Layout>
  );
};

export default AdminUsers;
