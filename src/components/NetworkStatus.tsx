import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { enhancedBlockchainMonitor } from '../services/EnhancedBlockchainMonitor';

interface NetworkStatusProps {
  className?: string;
}

interface NetworkHealth {
  [network: string]: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ className = '' }) => {
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth>({});
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const networks = [
    { id: 'ethereum', name: 'Ethereum', shortName: 'ETH' },
    { id: 'bsc', name: 'BSC', shortName: 'BSC' },
    { id: 'polygon', name: 'Polygon', shortName: 'MATIC' },
    { id: 'arbitrum', name: 'Arbitrum', shortName: 'ARB' },
    { id: 'optimism', name: 'Optimism', shortName: 'OP' }
  ];

  const checkNetworkHealth = async () => {
    setIsChecking(true);
    try {
      const health = await enhancedBlockchainMonitor.checkNetworkHealth();
      setNetworkHealth(health);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking network health:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkNetworkHealth();

    // Check every 5 minutes
    const interval = setInterval(checkNetworkHealth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const healthyNetworks = Object.values(networkHealth).filter(Boolean).length;
  const totalNetworks = networks.length;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wifi className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Network Status
          </h3>
        </div>
        
        <button
          onClick={checkNetworkHealth}
          disabled={isChecking}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Networks Online
          </span>
          <div className="flex items-center space-x-2">
            {healthyNetworks === totalNetworks ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className={`text-sm font-semibold ${
              healthyNetworks === totalNetworks ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {healthyNetworks}/{totalNetworks}
            </span>
          </div>
        </div>
      </div>

      {/* Individual network status */}
      <div className="space-y-2">
        {networks.map((network) => {
          const isHealthy = networkHealth[network.id];
          const isUnknown = networkHealth[network.id] === undefined;
          
          return (
            <div
              key={network.id}
              className="flex items-center justify-between p-2 rounded border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isUnknown ? 'bg-gray-300' : 
                  isHealthy ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {network.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {network.shortName}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isUnknown ? (
                  <span className="text-xs text-gray-400">Checking...</span>
                ) : isHealthy ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-600">Offline</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Last checked */}
      {lastChecked && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Payment support notice */}
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Payment Support:</strong> USDT payments are monitored 
          across all available networks simultaneously for maximum reliability.
        </p>
      </div>
    </div>
  );
};

export default NetworkStatus;
