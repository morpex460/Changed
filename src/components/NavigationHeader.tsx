import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface NavigationHeaderProps {
  onBackToMainSite?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ onBackToMainSite }) => {
  const handleBackToMainSite = () => {
    // ИСПРАВЛЕНИЕ: Очищаем сохраненное состояние wallet при возврате на главную
    try {
      localStorage.removeItem('yyps_wallet_state');
      console.log('🗑️ Состояние wallet очищено при возврате на главную страницу');
    } catch (error) {
      console.error('Ошибка очистки состояния wallet:', error);
    }
    
    if (onBackToMainSite) {
      onBackToMainSite();
    } else {
      // Navigate to main YYPS Trade site
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Back to main site */}
          <button
            onClick={handleBackToMainSite}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-300 hover:text-white transition-colors group min-w-0 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="text-xs sm:text-sm whitespace-nowrap">Back to Main Site</span>
          </button>

          {/* YYPS Trade branding */}
          <div className="flex items-center justify-center flex-1 mx-2 sm:mx-4">
            <span className="font-bold text-base sm:text-lg text-center">YYPS TRADE</span>
          </div>

          {/* External links */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => {
                // Скроллим к секции contact ВНУТРИ текущей страницы crypto payment
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  // Фолбэк - если секция не найдена, переходим на главную
                  window.location.href = '/#contact';
                }
              }}
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <span className="whitespace-nowrap">Support</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
