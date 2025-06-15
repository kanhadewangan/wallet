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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography className='text-white ' variant="h4" component="div" sx={{ flexGrow: 1 }}>
             🦄 GenNZ Wallet
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              {keys.length > 0 && (
                <Tooltip title="Your Public Key">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                    onClick={() => handleCopyKey(keys[0].publicKeys)}
                  >
                    {keys[0].publicKeys}
                  </Typography>
                </Tooltip>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<AccountCircle />}
              onClick={() => navigate('/profile')}
              sx={{
                mr: 2,
                color: 'white',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Profile
            </Button>
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
                  bgcolor: 'background.paper',
                  backgroundImage: 'none',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Market Stats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>$45,231</Typography>
                        <Typography variant="body2" color="text.secondary">Total Volume</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>2,345</Typography>
                        <Typography variant="body2" color="text.secondary">Active Users</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>12.5%</Typography>
                        <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>98.2%</Typography>
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

            {/* Public Keys Section */}
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
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Public Keys
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={checkAuth}
                      size="small"
                    >
                      Refresh
                    </Button>
                  </Box>
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
                                  wordBreak: 'break-all'
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
                        onClick={() => navigate('/generate-keys')}
                        startIcon={<AccountBalanceWallet />}
                      >
                        Generate New Key
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </MotionCard>
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