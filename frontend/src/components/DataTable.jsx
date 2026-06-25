import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DataTable = ({
  columns,
  rows,
  total,
  page,
  limit,
  sortBy,
  sortOrder,
  search,
  searchPlaceholder = 'Search...',
  onPageChange,
  onLimitChange,
  onSort,
  onSearch,
  filters,
  emptyMessage = 'No data found',
}) => {
  const handleSort = (field) => {
    if (!onSort) return;
    const isAsc = sortBy === field && sortOrder === 'asc';
    onSort(field, isAsc ? 'desc' : 'asc');
  };

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {onSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        {filters}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align || 'left'}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.field}
                      direction={sortBy === col.field ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align || 'left'}>
                      {col.render ? col.render(row) : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default DataTable;
