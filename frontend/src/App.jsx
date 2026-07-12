import { useState } from 'react';
import { checkHealth } from './services/api';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckBackend = async () => {
    setLoading(true);
    setError(null);
    setHealthData(null);
    
    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              FastAPI + React Starter
            </h1>
            <p className="text-gray-500 text-sm">Full-stack starter template</p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleCheckBackend}
              disabled={loading}
              className={`
                px-6 py-3 rounded-xl font-medium text-white transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                'Check Backend'
              )}
            </button>
          </div>

          <div className="min-h-[120px]">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold">Error</h3>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {healthData && (
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                  <h3 className="font-semibold text-gray-800">Connection Successful</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-md">{healthData.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Message</span>
                    <span className="font-medium text-gray-800">{healthData.message}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Timestamp</span>
                    <span className="font-medium text-gray-600 text-xs">
                      {new Date(healthData.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!error && !healthData && !loading && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Click the button to test connection
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
