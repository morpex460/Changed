import React from 'react';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { BaseCurrency } from '../types/wallet';
import { useIsMobile } from '../hooks/use-mobile';

interface PaymentMethodSelectorProps {
  baseCurrencies: BaseCurrency[];
  onBaseCurrencySelect: (baseCurrency: BaseCurrency) => void;
  isLoading: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  baseCurrencies,
  onBaseCurrencySelect,
  isLoading,
}) => {
  const isMobile = useIsMobile();
  
  const subscriptionPlan = {
    name: 'Full Access To Prop Trading Group',
    price: 499,
    features: [
      'Complete trading strategy with precise entries',
      'Specific stop-loss and take-profit levels',
      'Advanced risk management techniques',
      'Professional trader psychology',
      'Multi-timeframe analysis approach',
      'Strategies for different market conditions',
      'Access to private trading community',
      'Real trade analysis and breakdowns',
      'Challenge passing templates',
      'Bonus materials and exclusive webinars',
    ],
  };



  return (
    <div className="space-y-10">
      {/* Subscription Details */}
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          {/* ИСПРАВЛЕНИЕ: Уменьшено для мобильных устройств */}
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-normal py-1`}>
            Choose Your Payment Method
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg lg:text-xl'} text-gray-600 max-w-2xl mx-auto leading-relaxed`}>
            Secure cryptocurrency payment for complete access to YYPS Trade premium content
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 mb-10 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">{subscriptionPlan.name}</h3>
            <div className="text-center lg:text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${subscriptionPlan.price}
              </div>
              <div className="text-sm text-gray-600 font-medium">Lifetime Access</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {subscriptionPlan.features.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-start group">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              + {subscriptionPlan.features.length - 6} more exclusive benefits
            </span>
          </div>
        </div>

        {/* Benefits - ИСПРАВЛЕНИЕ: Уменьшено для мобильных */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="text-center p-2 sm:p-3 lg:p-4 group hover:bg-white hover:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12 lg:w-14 lg:h-14'} bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform`}>
              <Shield className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6 lg:h-7 lg:w-7'} text-green-600`} />
            </div>
            <h4 className={`font-bold text-gray-900 mb-1 lg:mb-2 ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}`}>Secure</h4>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}>Blockchain protection</p>
          </div>
          
          <div className="text-center p-2 sm:p-3 lg:p-4 group hover:bg-white hover:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12 lg:w-14 lg:h-14'} bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform`}>
              <Zap className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6 lg:h-7 lg:w-7'} text-blue-600`} />
            </div>
            <h4 className={`font-bold text-gray-900 mb-1 lg:mb-2 ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}`}>Instant</h4>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}>Automatic activation</p>
          </div>
          
          <div className="text-center p-2 sm:p-3 lg:p-4 group hover:bg-white hover:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12 lg:w-14 lg:h-14'} bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform`}>
              <TrendingUp className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6 lg:h-7 lg:w-7'} text-purple-600`} />
            </div>
            <h4 className={`font-bold text-gray-900 mb-1 lg:mb-2 ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}`}>Profitable</h4>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}>No fees</p>
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100">
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'} font-bold text-gray-900 mb-6 lg:mb-8 text-center`}>
          Supported Cryptocurrency
        </h3>
        
        {/* Base Currencies (USDT only) */}
        <div className="space-y-6">
          {baseCurrencies.map((baseCurrency) => (
            <button
              key={baseCurrency.symbol}
              onClick={() => onBaseCurrencySelect(baseCurrency)}
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8">
                  <div 
                    className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20 lg:w-24 lg:h-24'} rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform bg-white border border-gray-200 overflow-hidden`}
                  >
                    <img 
                      src={baseCurrency.icon} 
                      alt={`${baseCurrency.name} logo`}
                      className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16 lg:w-20 lg:h-20'} object-contain`}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        objectFit: 'contain',
                        imageRendering: 'crisp-edges'
                      }}
                    />
                  </div>
                  
                  <div className="text-center flex-1">
                    <h4 className={`${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'} font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 lg:mb-3`}>
                      {baseCurrency.name} ({baseCurrency.symbol})
                    </h4>
                    <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base lg:text-lg'} font-medium mb-1 lg:mb-2`}>Multiple networks available</p>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}>{baseCurrency.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-center bg-gray-100 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 group-hover:bg-blue-100 transition-colors mb-2 sm:mb-3 lg:mb-4`}>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 font-medium mb-1`}>Next Step</div>
                    <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>Choose Network</div>
                  </div>
                  
                  <ArrowRight className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7 lg:h-8 lg:w-8'} text-gray-400 group-hover:text-blue-500 transition-all duration-300 ml-auto group-hover:translate-x-2`} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">
           What if I want to pay in another cryptocurrency?
          </h4>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
           The website provides the fastest and most convenient payment method, but if you want to pay in a different way for example btc, eth, sol or anything else, please contact me.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
