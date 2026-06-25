import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const navItems = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
    { label: 'Create User', path: '/admin/users/create', icon: <PersonAddIcon /> },
    { label: 'Stores', path: '/admin/stores', icon: <StoreIcon /> },
    { label: 'Create Store', path: '/admin/stores/create', icon: <AddBusinessIcon /> },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
  USER: [
    { label: 'Stores', path: '/user/stores', icon: <StoreIcon /> },
    { label: 'My Ratings', path: '/user/ratings', icon: <StarIcon /> },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
  STORE_OWNER: [
    { label: 'Dashboard', path: '/owner/dashboard', icon: <DashboardIcon /> },
    { label: 'Store Ratings', path: '/owner/ratings', icon: <StarIcon /> },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
};

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap fontWeight={700}>
          Store Rating
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {items.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip label={user?.role} size="small" sx={{ mr: 2, color: 'white', borderColor: 'white' }} variant="outlined" />
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
