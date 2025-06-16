import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Receive = () => {
  const navigate = useNavigate();
  const [publicKey, setPublicKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your address');
        return;
      }

      const response = await axios.get('http://localhost:3000/payments/keys', {
        headers: {
          auth: token
        }
      });

      if (response.data && response.data.length > 0) {
        setPublicKey(response.data[0].publicKeys);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch public key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    // You might want to add a toast notification here
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'solana-address-qr.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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
            <h1 className="text-2xl font-bold text-white mb-6">Receive SOL</h1>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center">{error}</div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      id="qr-code"
                      value={publicKey}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400">
                    Your Solana Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={publicKey}
                      readOnly
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={downloadQR}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download QR Code
                </button>
                <div className="text-slate-400 text-sm text-center">
                  <p>Share this address to receive SOL</p>
                  <p className="mt-1">Make sure you're on Solana Devnet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receive; 