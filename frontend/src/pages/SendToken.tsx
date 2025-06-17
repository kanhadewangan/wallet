import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Wallet
} from 'lucide-react';
import axios from 'axios';

const SendToken = () => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('SOL');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get("http://localhost:3000/payments/keys", {
        headers: {
          auth: token
        }
      });
      
      console.log('Public key response:', response.data);
      
      if (response.data && response.data.length > 0) {
        setPublicKey(response.data[0].publicKeys);
        console.log('Public key set to:', response.data[0].publicKeys);
      }
    } catch (error) {
      console.error('Error fetching public key:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual token sending logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      setStep(2);
    } catch (err) {
      setError('Failed to send token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header with Public Key */}
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-[#1C1D21] rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold ml-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                Send SOL
              </h1>
            </div>
          </div>
          
          {/* Public Key Display - Updated styling */}
          <div className="bg-[#1C1D21] rounded-xl p-4 border border-[#2D2E32]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-[#14F195]" />
                <span className="text-sm font-medium text-[#14F195]">Your Address:</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-[#2D2E32] rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#14F195]" />
                ) : (
                  <Copy className="w-4 h-4 text-[#14F195]" />
                )}
              </button>
            </div>
            <div className="bg-[#2D2E32] p-3 rounded-lg">
              <p className="text-sm font-mono break-all text-white">
                {publicKey ? (
                  publicKey
                ) : (
                  <span className="text-gray-400">Loading address...</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1C1D21] rounded-2xl p-6 shadow-xl border border-[#2D2E32]"
        >
          {step === 1 ? (
            <form onSubmit={handleSend} className="space-y-6">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-[#14F195] mb-2">
                  Select Token
                </label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-[#2D2E32] border border-[#3D3E42] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent"
                >
                  <option value="SOL">Solana (SOL)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-medium text-[#14F195] mb-2">
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter Solana address"
                    className="w-full bg-[#2D2E32] border border-[#3D3E42] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#3D3E42] rounded-lg transition-colors"
                  >
                    <QrCode className="w-5 h-5 text-[#14F195]" />
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-[#14F195] mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#2D2E32] border border-[#3D3E42] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#14F195]">
                    {token}
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !recipient || !amount}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all
                  ${isLoading || !recipient || !amount
                    ? 'bg-[#2D2E32] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>Send {token}</span>
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#14F195]/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#14F195]" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                Transaction Successful!
              </h2>
              <p className="text-gray-400">
                Your {token} has been sent successfully.
              </p>
              <div className="bg-[#2D2E32] p-4 rounded-xl border border-[#3D3E42]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#14F195]">Transaction Hash</span>
                  <button className="p-1 hover:bg-[#3D3E42] rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-mono break-all text-gray-300">
                  0x1234...5678
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-medium transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SendToken; 