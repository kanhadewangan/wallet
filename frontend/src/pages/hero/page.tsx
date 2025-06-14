import { Shield, Zap, Globe, ArrowRight, Download, Smartphone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HeroPage() {
  const [showLoginCard, setShowLoginCard] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginCard(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleCloseLogin = () => {
    setShowLoginCard(false)
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Zap className="w-3 h-3 mr-1" />
            Next-Gen Web3 Wallet
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Your Gateway to the
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Decentralized{" "}
              </span>
              Future
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Secure, fast, and intuitive. Manage your crypto assets, NFTs, and DeFi investments with the most trusted
              wallet in Web3.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Wallet
            </button>
            <button
              className="flex items-center border border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate('/login')}
            >
              Connect Wallet
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10M+</div>
              <div className="text-slate-400 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">$50B+</div>
              <div className="text-slate-400 mt-1">Assets Secured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">99.9%</div>
              <div className="text-slate-400 mt-1">Uptime</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Bank-Grade Security</h3>
            <p className="text-slate-400">
              Multi-layer encryption and hardware wallet integration keep your assets safe from threats.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Chain Support</h3>
            <p className="text-slate-400">
              Access Ethereum, Polygon, BSC, and 50+ blockchains from a single interface.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Mobile First</h3>
            <p className="text-slate-400">
              Seamless experience across desktop, mobile, and browser extension platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Login Popup Card */}
      {showLoginCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4 bg-slate-800/90 border border-slate-700 rounded-lg backdrop-blur-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
              <button
                className="text-slate-400 hover:text-white p-2"
                onClick={handleCloseLogin}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-400 mb-6">
              Connect your wallet to access your assets and start trading.
            </p>
            <div className="space-y-4">
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg"
                onClick={handleLogin}
              >
                Connect Wallet
              </button>
              <button
                className="w-full border border-slate-600 text-white hover:bg-slate-800 py-3 rounded-lg"
                onClick={handleCloseLogin}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 