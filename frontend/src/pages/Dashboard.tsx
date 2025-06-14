import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountBalanceWallet,
  Send,
  Receipt,
  MoreVert,
  TrendingUp,
  Security,
  ArrowUpward,
  ArrowDownward,
  Star,
  StarBorder,
  Notifications,
  Search,
  AccountCircle,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ECDC4',
    },
    secondary: {
      main: '#FF6B6B',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
});

// Mock data for tokens
const tokens = [
  { name: 'Solana', symbol: 'SOL', price: 98.45, change: 2.5, icon: '🌞' },
  { name: 'USDC', symbol: 'USDC', price: 1.00, change: 0.1, icon: '💵' },
  { name: 'Bonk', symbol: 'BONK', price: 0.00001234, change: -5.2, icon: '🐕' },
];

// Mock data for market stats
const marketStats = [
  { label: '24h Volume', value: '$1.2B', change: 12.5 },
  { label: 'Market Cap', value: '$42.5B', change: 3.2 },
  { label: 'Active Users', value: '125K', change: 8.7 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState('0.00');
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Verify token with backend
      setIsAuthenticated(true);
      // Mock balance data - replace with actual API call
      setBalance('10.5');
    }
    setLoading(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          sx={{
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Please Login to Access Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Connect your wallet to view your balance and manage your assets
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Login Now
            </Button>
          </CardContent>
        </MotionCard>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Solana Wallet
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>U</Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid component="div" item xs={12} md={8}>
              <MotionCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                sx={{
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Total Balance
                  </Typography>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    ${balance}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid component="div" item xs={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Send />}
                        sx={{ borderRadius: 2 }}
                      >
                        Send
                      </Button>
                    </Grid>
                    <Grid component="div" item xs={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Receipt />}
                        sx={{ borderRadius: 2 }}
                      >
                        Receive
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid component="div" item xs={12} md={4}>
              <MotionCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                sx={{
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security color="success" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Wallet Protected
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">
                      Last Backup: 2 days ago
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Market Stats */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {marketStats.map((stat, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <MotionCard
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      sx={{ 
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {stat.change > 0 ? (
                            <ArrowUpward color="success" fontSize="small" />
                          ) : (
                            <ArrowDownward color="error" fontSize="small" />
                          )}
                          <Typography
                            variant="body2"
                            color={stat.change > 0 ? 'success.main' : 'error.main'}
                            sx={{ ml: 0.5 }}
                          >
                            {Math.abs(stat.change)}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Token List */}
            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{ 
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" className='p-3'>
                      Your Tokens
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search tokens..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'text.primary',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                        },
                      }}
                    />
                  </Box>
                  <List>
                    {tokens.map((token, index) => (
                      <React.Fragment key={token.symbol}>
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end">
                              <StarBorder />
                            </IconButton>
                          }
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.05)',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.dark' }}>
                              {token.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1">
                                  {token.name}
                                </Typography>
                                <Chip
                                  label={token.symbol}
                                  size="small"
                                  sx={{ 
                                    height: 20,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'text.primary'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2">
                                  ${token.price.toLocaleString()}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color={token.change > 0 ? 'success.main' : 'error.main'}
                                >
                                  {token.change > 0 ? '+' : ''}{token.change}%
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < tokens.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Quick Actions & Security */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MotionCard
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    sx={{ 
                      borderRadius: 4,
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AccountBalanceWallet />}
                            sx={{ 
                              py: 2,
                              borderColor: 'rgba(255,255,255,0.1)',
                              '&:hover': {
                                borderColor: 'rgba(255,255,255,0.2)',
                                bgcolor: 'rgba(255,255,255,0.05)',
                              }
                            }}
                          >
                            Airdrop
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<TrendingUp />}
                            sx={{ 
                              py: 2,
                              borderColor: 'rgba(255,255,255,0.1)',
                              '&:hover': {
                                borderColor: 'rgba(255,255,255,0.2)',
                                bgcolor: 'rgba(255,255,255,0.05)',
                              }
                            }}
                          >
                            Swap
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid item xs={12}>
                  <MotionCard
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    sx={{ 
                      borderRadius: 4,
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Security color="primary" />
                        <Typography variant="h6">
                          Security Status
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Wallet Protection
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          color="success"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'success.main',
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Last Backup
                        </Typography>
                        <Typography variant="body2">
                          2 days ago
                        </Typography>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
            </Grid>

            {/* Recent Transactions */}
            <Grid item xs={12}>
              <MotionCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                sx={{ 
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div>
                  <CardContent className=''>
                    <Typography variant="h6" gutterBottom>
                      Recent Transactions
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 200,
                      color: 'text.secondary'
                    }}>
                      No recent transactions
                    </Box>
                  </CardContent>
                </div>
              </MotionCard>
            </Grid>
          </Grid>
        </Container>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <Avatar sx={{ mr: 1 }}>U</Avatar> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ mr: 1 }}>S</Avatar> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Avatar sx={{ mr: 1 }}>L</Avatar> Logout
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 