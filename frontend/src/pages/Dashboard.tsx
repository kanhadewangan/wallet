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
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
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
  ContentCopy,
  Refresh,
  Add,
  QrCode,
  SwapHoriz,
  History,
  Lock,
  Shield,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MenuIcon } from 'lucide-react';

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
  const [keys, setKeys] = useState<Array<{ publicKeys: string }>>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect( () => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Verify token with backend
      setIsAuthenticated(true);
      // Mock balance data - replace with actual API call
      setBalance('10.5');
    }
    const response = await axios.get("http://localhost:3000/payments/keys",  {
      headers:{
        auth:token
      }
    });

    const res = await axios.get
    setKeys(response.data);
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

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
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
      <Box  sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          sx={{ 
            bgcolor: '#0A0B0D',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'none'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1,
              background: 'linear-gradient(to right, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Solana Wallet
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: '#1C1D21',
                px: 2,
                py: 1,
                borderRadius: 2,
                border: '1px solid #2D2E32'
              }}>
                <Typography variant="body2" sx={{ color: '#14F195' }}>
                  {keys[0]?.publicKeys || 'No keys found'}
                </Typography>
                <Tooltip title="Copy Public Key">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyKey(keys[0]?.publicKeys)}
                    sx={{ color: '#14F195' }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Public key copied to clipboard"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3} alignItems="stretch">
            {/* Market Stats */}
            <Grid item xs={12}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  bgcolor: '#1C1D21',
                  backgroundImage: 'none',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  border: '1px solid #2D2E32',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#14F195',
                    mb: 3,
                    background: 'linear-gradient(to right, #9945FF, #14F195)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Market Stats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: '#2D2E32',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #3D3E42'
                      }}>
                        <Typography variant="h4" sx={{ color: '#14F195', mb: 1 }}>$45,231</Typography>
                        <Typography variant="body2" color="text.secondary">Total Volume</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: '#2D2E32',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #3D3E42'
                      }}>
                        <Typography variant="h4" sx={{ color: '#14F195', mb: 1 }}>2,345</Typography>
                        <Typography variant="body2" color="text.secondary">Active Users</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: '#2D2E32',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #3D3E42'
                      }}>
                        <Typography variant="h4" sx={{ color: '#14F195', mb: 1 }}>12.5%</Typography>
                        <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: '#2D2E32',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #3D3E42'
                      }}>
                        <Typography variant="h4" sx={{ color: '#14F195', mb: 1 }}>98.2%</Typography>
                        <Typography variant="body2" color="text.secondary">Uptime</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} md={4}>
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

            {/* Token List */}
            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  bgcolor: '#1C1D21',
                  backgroundImage: 'none',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  border: '1px solid #2D2E32',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#14F195',
                      background: 'linear-gradient(to right, #9945FF, #14F195)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Token List
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      sx={{
                        color: '#14F195',
                        borderColor: '#2D2E32',
                        '&:hover': {
                          borderColor: '#14F195',
                          bgcolor: 'rgba(20, 241, 149, 0.1)'
                        }
                      }}
                    >
                      Add Token
                    </Button>
                  </Box>
                  <List>
                    {tokens.map((token, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          bgcolor: '#2D2E32',
                          border: '1px solid #3D3E42',
                          '&:hover': {
                            bgcolor: '#3D3E42'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar src={token.icon} alt={token.name} />
                        </ListItemIcon>
                        <ListItemText
                          primary={token.name}
                          secondary={`${token.balance} ${token.symbol}`}
                          primaryTypographyProps={{ color: '#14F195' }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                        <Typography variant="body1" sx={{ color: '#14F195' }}>
                          ${token.value}
                        </Typography>
                      </ListItem>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    sx={{
                      bgcolor: '#1C1D21',
                      backgroundImage: 'none',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      border: '1px solid #2D2E32'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ 
                        color: '#14F195',
                        background: 'linear-gradient(to right, #9945FF, #14F195)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Quick Actions
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Send />}
                            onClick={() => navigate('/send')}
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(to right, #9945FF, #14F195)',
                              '&:hover': {
                                opacity: 0.9
                              }
                            }}
                          >
                            Send
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<QrCode />}
                            sx={{
                              borderRadius: 2,
                              color: '#14F195',
                              borderColor: '#2D2E32',
                              '&:hover': {
                                borderColor: '#14F195',
                                bgcolor: 'rgba(20, 241, 149, 0.1)'
                              }
                            }}
                          >
                            Receive
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<SwapHoriz />}
                            sx={{
                              borderRadius: 2,
                              color: '#14F195',
                              borderColor: '#2D2E32',
                              '&:hover': {
                                borderColor: '#14F195',
                                bgcolor: 'rgba(20, 241, 149, 0.1)'
                              }
                            }}
                          >
                            Swap
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<History />}
                            sx={{
                              borderRadius: 2,
                              color: '#14F195',
                              borderColor: '#2D2E32',
                              '&:hover': {
                                borderColor: '#14F195',
                                bgcolor: 'rgba(20, 241, 149, 0.1)'
                              }
                            }}
                          >
                            History
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AccountCircle />}
                            onClick={() => navigate('/profile')}
                            sx={{
                              borderRadius: 2,
                              color: '#14F195',
                              borderColor: '#2D2E32',
                              '&:hover': {
                                borderColor: '#14F195',
                                bgcolor: 'rgba(20, 241, 149, 0.1)'
                              }
                            }}
                          >
                            Profile
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid item xs={12}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    sx={{
                      bgcolor: '#1C1D21',
                      backgroundImage: 'none',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      border: '1px solid #2D2E32'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ 
                        color: '#14F195',
                        background: 'linear-gradient(to right, #9945FF, #14F195)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Security
                      </Typography>
                      <List>
                        <ListItem
                          button
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: '#2D2E32',
                            border: '1px solid #3D3E42',
                            '&:hover': {
                              bgcolor: '#3D3E42'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Lock sx={{ color: '#14F195' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Two-Factor Authentication"
                            secondary="Not enabled"
                            primaryTypographyProps={{ color: '#14F195' }}
                            secondaryTypographyProps={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                        <ListItem
                          button
                          sx={{
                            borderRadius: 2,
                            bgcolor: '#2D2E32',
                            border: '1px solid #3D3E42',
                            '&:hover': {
                              bgcolor: '#3D3E42'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Shield sx={{ color: '#14F195' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Security Score"
                            secondary="Good"
                            primaryTypographyProps={{ color: '#14F195' }}
                            secondaryTypographyProps={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfileClick}>
            <Avatar sx={{ mr: 1 }}>U</Avatar> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ mr: 1 }}>S</Avatar> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Avatar sx={{ mr: 1 }}>L</Avatar> Logout
          </MenuItem>
        </Menu>

        <Dialog
          open={profileOpen}
          onClose={handleProfileClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            pb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>User Profile</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Your Public Keys
              </Typography>
              {keys.length > 0 ? (
                <List sx={{ 
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  p: 1
                }}>
                  {keys.map((key, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Copy Public Key">
                            <IconButton
                              edge="end"
                              onClick={() => handleCopyKey(key.publicKeys)}
                              sx={{ color: 'text.secondary' }}
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: 'monospace',
                              wordBreak: 'break-all',
                              color: 'text.primary'
                            }}
                          >
                            {key.publicKeys}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Key #{index + 1}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 200,
                  color: 'text.secondary',
                  gap: 2
                }}>
                  <Typography variant="body1">
                    No keys found
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleProfileClose();
                      navigate('/generate-keys');
                    }}
                    startIcon={<AccountBalanceWallet />}
                    sx={{
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Generate New Key
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            pt: 2,
            px: 3
          }}>
            <Button 
              onClick={handleProfileClose}
              variant="outlined"
              sx={{
                color: 'text.primary',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 