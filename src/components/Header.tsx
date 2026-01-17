import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Закрываем меню после навигации
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/logo/Tgo.jpg"
              alt="YYPS Trade"
              className="h-16 sm:h-16 md:h-16 w-auto rounded-lg"
            />
            <span className="ml-2 sm:ml-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {isMobile ? 'Yyps' : 'Yyps Trade'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => scrollToSection('group-content')}
              className="bg-gray-900 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm lg:text-lg"
            >
              Group
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="bg-gray-100 text-gray-900 px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm lg:text-lg"
            >
              Contacts
            </button>
            <button
              onClick={() => scrollToSection('membership')}
              className="bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-lg"
            >
              Join Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection('group-content')}
                className="w-full text-left bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Group
              </button>
              <button
                onClick={() => scrollToSection('footer')}
                className="w-full text-left bg-gray-100 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Contacts
              </button>
              <button
                onClick={() => scrollToSection('membership')}
                className="w-full text-left bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
