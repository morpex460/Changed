import React from 'react';
import { CheckCircle, TrendingUp, BookOpen, Users, ArrowRight, Loader2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useDiscordInvite } from '../hooks/useDiscordInvite';

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
  </svg>
);
import { Transaction } from '../types/wallet';
import { useIsMobile } from '../hooks/use-mobile';


interface SuccessPageProps {
  transaction?: Transaction | null;
  onReset: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ transaction, onReset }) => {
  const isMobile = useIsMobile();
  const { inviteUrl, isLoading, error, hasRequested, getDiscordInvite, resetState, openDiscordInvite } = useDiscordInvite();

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Success Header */}
      <div className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl text-center border border-green-100">
        <div className={`animate-bounce ${isMobile ? 'w-16 h-16' : 'w-20 h-20 lg:w-24 lg:h-24'} bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-xl`}>
          <CheckCircle className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10 lg:h-14 lg:w-14'} text-white`} />
        </div>
        
        <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-5 lg:mb-6 leading-normal py-2`}>
          Payment Successful
        </h1>

        <p className={`${isMobile ? 'text-base' : 'text-lg lg:text-xl'} text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed`}>
          Your payment has been processed successfully! You now have full access to YYPS Trade premium content and our exclusive Discord community.
        </p>

      </div>

      {/* Welcome Video Section */}
      <div className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold text-gray-900 mb-6 sm:mb-7 lg:mb-8 text-center`}>
          Welcome to YYPS Trade!
        </h2>
        
        {/* Video Container */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-gray-100 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-dashed border-gray-300 text-center">
            <div className={`w-full ${isMobile ? 'h-48' : 'h-64 lg:h-96'} bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg lg:rounded-xl border-2 border-blue-200 flex items-center justify-center relative overflow-hidden`}>
              {/* Actual video element */}
              <video 
                className="w-full h-full object-cover rounded-xl"
                controls
                poster="/images/crypto/usdt.png"
              >
                <source src="/videos/welcome.mp4" type="video/mp4" />
                {/* Fallback content */}
                <div className="text-center">
                  <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20 lg:w-24 lg:h-24'} bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4`}>
                    <svg className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9 lg:w-10 lg:h-10'} text-white`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-700 mb-2`}>Welcome Video</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Your browser doesn't support HTML5 video
                  </p>
                </div>
              </video>
            </div>
          </div>
        </div>

        {/* Getting Started Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200">
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 text-center`}>
            Getting Started Instructions
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <h4 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-3 lg:mb-4 flex items-start ${isMobile ? 'items-center' : ''}`}>
                <span className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-7 h-7 lg:w-8 lg:h-8 text-sm'} bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold flex-shrink-0`} style={{ lineHeight: '1' }}>1</span>
                <span className="flex-1">Watch the video instructions in full</span>
              </h4>
              <h4 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-3 lg:mb-4 flex items-start ${isMobile ? 'items-center' : ''}`}>
                <span className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-7 h-7 lg:w-8 lg:h-8 text-sm'} bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold flex-shrink-0`} style={{ lineHeight: '1' }}>2</span>
                <span className="flex-1">Click on the link below to join the Discord group</span>
              </h4>
              <h4 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-3 lg:mb-4 flex items-start ${isMobile ? 'items-center' : ''}`}>
                <span className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-7 h-7 lg:w-8 lg:h-8 text-sm'} bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold flex-shrink-0`} style={{ lineHeight: '1' }}>3</span>
                <span className="flex-1">Wait until the administrator assigns you a role to access all content</span>
              </h4>
              <h4 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-3 lg:mb-4 flex items-start ${isMobile ? 'items-center' : ''}`}>
                <span className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-7 h-7 lg:w-8 lg:h-8 text-sm'} bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold flex-shrink-0`} style={{ lineHeight: '1' }}>4</span>
                <span className="flex-1">Each new section will open every 2 days after the previous one</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Discord Access Section */}
      <div className="bg-white rounded-3xl p-12 shadow-2xl text-center border border-green-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-200">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <DiscordIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Discord Access Ready</h2>
          </div>
          
          {!hasRequested && (
            <>
              <p className="text-gray-700 mb-6">
                Click the button below to get a one-time link to join our private Discord server
              </p>
              <button
                onClick={getDiscordInvite}
                disabled={isLoading}
                className="inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <DiscordIcon className="h-6 w-6" />
                )}
                <span>{isLoading ? 'Getting invite…...' : 'Get Discord Invite'}</span>
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </>
          )}

          {hasRequested && inviteUrl && (
            <>
              <p className="text-green-700 mb-6 font-medium">
                ✅ Your one-time link is ready! Click the button below to go to Discord
              </p>
              <div className="space-y-4">
                <button
                  onClick={openDiscordInvite}
                  className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <DiscordIcon className="h-6 w-6" />
                  <span>Go to Discord</span>
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This link is one-time and will be unavailable after use
                </p>
              </div>
            </>
          )}

          {hasRequested && error && (
            <>
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-red-800 mb-1">Error retrieving invite</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetState();
                  getDiscordInvite();
                }}
                className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RefreshCw className="h-6 w-6" />
                <span>Try again</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
