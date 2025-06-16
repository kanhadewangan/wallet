import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountCircle,
  Edit,
  Security,
  History,
  Send,
  Receipt,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Settings, LogOut, Wallet, Activity, ArrowRight } from 'lucide-react';
import axios from 'axios';

const MotionCard = motion(Card);

interface UserProfile {
  name: string;
  email: string;
  walletAddress: string;
  balance: string;
  joinDate: string;
}

interface CustomJwtPayload {
  users: {
    username: string;
    email: string;
  }
}

const Profile = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<string>('');

  useEffect(() => {
    checkAuth();
    handleKeys();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setIsAuthenticated(true);
        console.log(decoded);
        setProfile({
          name: decoded.users.username as string || 'User',
          email: decoded.users.email as string || 'user@example.com',
          walletAddress: keys,
          balance: '10.5 SOL',
          joinDate: '2024-01-01',
        });
      } catch (err) {
        console.error('Token verification failed:', err);
        setError('Invalid token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const handleKeys = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const data = await axios.get("http://localhost:3000/payments/keys", {
          headers: {
            auth: token
          }
        });
        setKeys(data.data[0].publicKeys)
        console.log(keys);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Please Login</h2>
            <p className="text-slate-400">Connect your wallet to view your profile</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
                <p className="text-slate-400">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-slate-400 hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Wallet Balance</h2>
              <Wallet className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{profile?.balance}</div>
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-mono break-all">{keys}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(keys || '');
                  // You might want to add a toast notification here
                }}
                className="ml-2 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Security Status</h2>
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">2FA Enabled</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Backup</span>
                <span className="text-slate-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Send</h3>
              <ArrowRight className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-slate-400 text-sm">Transfer funds to another wallet</p>
          </button>

          <button className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Receive</h3>
              <ArrowRight className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-slate-400 text-sm">Get your wallet address</p>
          </button>

          <button className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Activity</h3>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-slate-400 text-sm">View transaction history</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 