import React from 'react';
import { ArrowRight, Clock, DollarSign, Shield, Zap } from 'lucide-react';
import { BaseCurrency, Network } from '../types/wallet';
import { useIsMobile } from '../hooks/use-mobile';

interface NetworkSelectorProps {
  baseCurrency: BaseCurrency;
  networks: Network[];
  onNetworkSelect: (network: Network) => void;
  isLoading: boolean;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  baseCurrency,
  networks,
  onNetworkSelect,
  isLoading,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-10">
      {/* Currency confirmation */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-6 lg:mb-8">
          {/* ИСПРАВЛЕНИЕ: Уменьшено для мобильных */}
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 lg:mb-4 leading-normal py-1`}>
            Select Network for {baseCurrency.symbol}
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg lg:text-xl'} text-gray-600 max-w-2xl mx-auto leading-relaxed`}>
            Choose the blockchain network for your {baseCurrency.name} payment
          </p>
        </div>

        {/* Selected currency display */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 rounded-2xl shadow-lg bg-white border border-gray-200 relative">
              <img 
                src={baseCurrency.icon} 
                alt={`${baseCurrency.name} logo`}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{baseCurrency.name}</h3>
              <p className="text-gray-600">{baseCurrency.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Network selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100">
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'} font-bold text-gray-900 mb-6 lg:mb-8 text-center`}>
          Choose Blockchain Network
        </h3>
        
        <div className="space-y-4">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => onNetworkSelect(network)}
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
            >
              <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
                <div className={`flex items-center ${isMobile ? 'justify-center space-x-4' : 'space-x-6'}`}>
                  <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16 lg:w-18 lg:h-18'} bg-white rounded-xl lg:rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-gray-200 relative`}>
                    {network.icon ? (
                      <img 
                        src={network.icon} 
                        alt={`${network.name} logo`}
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-8 h-8' : 'w-10 h-10 lg:w-12 lg:h-12'} object-contain`}
                      />
                    ) : (
                      <Shield className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'h-8 w-8' : 'h-9 w-9 lg:h-10 lg:w-10'} text-blue-600`} />
                    )}
                  </div>
                  
                  <div className={`${isMobile ? 'text-center' : 'text-left'} flex-1`}>
                    <h4 className={`${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'} font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 lg:mb-2`}>
                      {network.name}
                    </h4>
                    <p className={`text-gray-600 mb-1 lg:mb-2 font-medium ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}`}>{network.fullName}</p>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}>{network.description}</p>
                  </div>
                </div>
                
                <div className={`${isMobile ? 'w-full' : 'text-right'}`}>
                  <div className={`flex ${isMobile ? 'flex-row justify-between' : 'items-center space-x-4'} mb-3 lg:mb-4`}>
                    <div className={`text-center bg-gray-100 rounded-lg lg:rounded-xl p-2 lg:p-3 group-hover:bg-blue-100 transition-colors ${isMobile ? 'flex-1 mr-2' : ''}`}>
                      <div className={`flex items-center ${isMobile ? 'justify-center text-xs' : 'text-sm'} text-gray-700 font-medium mb-1`}>
                        <Clock className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                        {network.processingTime}
                      </div>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>Processing</div>
                    </div>
                    
                    <div className={`text-center bg-gray-100 rounded-lg lg:rounded-xl p-2 lg:p-3 group-hover:bg-blue-100 transition-colors ${isMobile ? 'flex-1 ml-2' : ''}`}>
                      <div className={`flex items-center ${isMobile ? 'justify-center text-xs' : 'text-sm'} text-gray-700 font-medium mb-1`}>
                        <DollarSign className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                        {network.fees}
                      </div>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>Fees</div>
                    </div>
                  </div>
                  
                  <ArrowRight className={`${isMobile ? 'h-5 w-5 mx-auto' : 'h-6 w-6 ml-auto'} text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-2`} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkSelector;
