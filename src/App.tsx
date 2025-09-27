import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CryptoWalletApp from './components/CryptoWalletApp';
import { useImagePreloader } from './hooks/useImagePreloader';

function App() {
  // Инициализация предварительной загрузки изображений
  const { imagesLoaded, loadingProgress, totalImages } = useImagePreloader();

  useEffect(() => {
    if (imagesLoaded) {
      console.log('🎉 Все изображения предзагружены и готовы к отображению!');
    }
  }, [imagesLoaded]);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<CryptoWalletApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
