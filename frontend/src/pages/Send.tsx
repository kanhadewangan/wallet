import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send } from 'lucide-react';

const Sends = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [fromKey, setFromKey] = useState('');
  const [toKey, setToKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

      setSuccess('Transaction successful!');
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
    </div>
  );
};

export default Sends; 