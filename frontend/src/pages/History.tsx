import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Copy, Check } from 'lucide-react';
import axios from 'axios';

interface Transaction {
  fromKey: string;
  toKey: string;
  amount: number;
  timestamp: string;
  signature: string;
}

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSignature, setCopiedSignature] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view history");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/payments/history/all", {
        headers: {
          auth: token,
        }
      });
      
      const transactionData = Array.isArray(response.data) ? response.data : [response.data];
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSignature(text);
    setTimeout(() => setCopiedSignature(null), 2000);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transaction History
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-4">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">From</p>
                      <p className="text-white font-mono break-all">{tx.fromKey}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">To</p>
                      <p className="text-white font-mono break-all">{tx.toKey}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Amount</p>
                      <p className="text-white">{tx.amount} SOL</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Date</p>
                      <p className="text-white">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-sm">Signature</p>
                      <button
                        onClick={() => copyToClipboard(tx.signature)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedSignature === tx.signature ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{tx.signature}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
