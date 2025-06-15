import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ContentCopy, Refresh } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionPaper = motion(Paper);

interface KeyPair {
  publicKeys: string;
}

const COOLDOWN_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

const GenerateKeys = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [copied, setCopied] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    // Check if there's a cooldown in localStorage
    const lastGenerated = localStorage.getItem('lastKeyGenerated');
    if (lastGenerated) {
      const timeLeft = COOLDOWN_TIME - (Date.now() - parseInt(lastGenerated));
      if (timeLeft > 0) {
        setCooldown(timeLeft);
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1000) {
            clearInterval(timer);
            localStorage.removeItem('lastKeyGenerated');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateNewKeyPair = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:3000/payments/generate', {}, {
        headers: {
          auth: token
        }
      });

      setKeyPair(response.data.data);
      // Set cooldown
      localStorage.setItem('lastKeyGenerated', Date.now().toString());
      setCooldown(COOLDOWN_TIME);
    } catch (err) {
      setError('Failed to generate key pair. Please try again.');
      console.error('Error generating key pair:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <MotionPaper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              mb: 4
            }}
          >
            Generate Solana Key Pair
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={generateNewKeyPair}
              disabled={loading || cooldown > 0}
              startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }}
            >
              {loading ? 'Generating...' : cooldown > 0 ? `Wait ${formatTime(cooldown)}` : 'Generate New Key Pair'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {keyPair && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Your Public Key
              </Typography>
              <TextField
                fullWidth
                value={keyPair.publicKeys}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton
                        onClick={() => copyToClipboard(keyPair.publicKeys)}
                        edge="end"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Keep your private key secure and never share it with anyone. The private key is stored securely on our servers.
              </Alert>
            </Box>
          )}
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default GenerateKeys; 