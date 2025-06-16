import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Space background */}
            <circle cx="100" cy="100" r="90" fill="#1a1a2e" />
            
            {/* Stars */}
            <circle cx="50" cy="50" r="1" fill="white" />
            <circle cx="150" cy="30" r="1.5" fill="white" />
            <circle cx="80" cy="120" r="1" fill="white" />
            <circle cx="130" cy="160" r="1.5" fill="white" />
            <circle cx="180" cy="80" r="1" fill="white" />
            
            {/* Planet */}
            <circle cx="100" cy="100" r="40" fill="#4a90e2" />
            <circle cx="100" cy="100" r="35" fill="#357abd" />
            
            {/* Rings */}
            <ellipse
              cx="100"
              cy="100"
              rx="60"
              ry="15"
              fill="none"
              stroke="#4a90e2"
              strokeWidth="2"
              transform="rotate(-20 100 100)"
            />
            
            {/* Satellite */}
            <circle cx="160" cy="60" r="8" fill="#e0e0e0" />
            <path
              d="M160 68 L160 80"
              stroke="#e0e0e0"
              strokeWidth="2"
            />
            <path
              d="M152 60 L168 60"
              stroke="#e0e0e0"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-9xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        <Link 
          to="/dashboard" 
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 