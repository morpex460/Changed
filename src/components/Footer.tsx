import React from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer id="footer" className="bg-gray-900 text-white py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4 lg:mb-6">
              <img
                src="/images/logo/tgo.jpg"
                alt="YYPS Trade"
                className="h-8 sm:h-10 lg:h-12 w-auto rounded-lg"
              />
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl lg:text-2xl font-bold">
                {isMobile ? 'Yyps' : 'Yyps Trade'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 lg:mb-6 max-w-md">
              Professional trading strategies for successfully passing prop firm challenges 
              and receiving stable payouts.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-sm sm:text-base text-green-400 font-bold">
                $100,000+ successful payouts
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 lg:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 lg:space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                >
                 Membership Plans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('payouts')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                >
                   Payout Proof
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                >
                   Group Structure
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 lg:mb-4">Contact</h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Telegram</p>
                  <a href="#" className="text-sm sm:text-base text-blue-400 hover:text-blue-300">@yypstrade</a>
                  
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Email</p>
                  <a href="mailto:support@yypstrade.com" className="text-sm sm:text-base text-blue-400 hover:text-blue-300 break-all">
                    qcrb355@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">24/7 Support</p>
                  <p className="text-sm sm:text-base text-blue-400">Online Consultations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2025 Yyps Trade. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0">
              <p className="text-gray-400 text-xs sm:text-sm text-center md:text-right">
                Trading involves risks. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
