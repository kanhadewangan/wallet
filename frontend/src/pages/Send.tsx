import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Check, Copy, Send, Wallet } from 'lucide-react';

const Sends = () => {
  const navigate = useNavigate();
  const [publicKey, setPublicKey] = useState("")
  const [amount, setAmount] = useState('');
  const [fromKey, setFromKey] = useState('');
  const [toKey, setToKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    signature?: string;
    toAddress?: string;
    amount?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to send SOL');
        return;
      }

      const response = await axios.post('http://localhost:3000/payments/p2p', {
        fromKey,
        toKey,
        amount: parseFloat(amount)
      }, {
        headers: {
          auth: token
        }
      });

      // Store transaction details
      setTransactionDetails({
        signature: response.data.signature,
        toAddress: toKey,
        amount: parseFloat(amount)
      });
      setShowSuccess(true);
      
      // Clear form
      setAmount('');
      setFromKey('');
      setToKey('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send SOL');
    } finally {
      setLoading(false);
    }
  };

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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className='w-3xl  mx-auto p-5'>
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
                  <span className="text-gray-400">No keys</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Send SOL</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="0.0"
                  step="0.000000001"
                  required
                />
              </div>

              <div>
                <label htmlFor="fromKey" className="block text-sm font-medium text-slate-400 mb-1">
                  From Address
                </label>
                <input
                  type="text"
                  id="fromKey"
                  value={fromKey}
                  onChange={(e) => setFromKey(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter sender's public key"
                  required
                />
              </div>

              <div>
                <label htmlFor="toKey" className="block text-sm font-medium text-slate-400 mb-1">
                  To Address
                </label>
                <input
                  type="text"
                  id="toKey"
                  value={toKey}
                  onChange={(e) => setToKey(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter recipient's public key"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-400 text-sm">{success}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send SOL
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && transactionDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Transaction Successful!</h2>
              
              <div className="space-y-3 text-left">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Amount</p>
                  <p className="text-white font-mono">{transactionDetails.amount} SOL</p>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">To Address</p>
                  <p className="text-white font-mono break-all">{transactionDetails.toAddress}</p>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Transaction Signature</p>
                  <p className="text-white font-mono text-sm break-all">{transactionDetails.signature}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate('/dashboard');
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sends; 