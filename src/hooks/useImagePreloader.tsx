import { useState, useEffect } from 'react';

// Все изображения для предварительной загрузки
const imagesToPreload = [
  // Сертификаты из Hero слайдера
  '/images/certificates/tmo 7.JPEG',
  '/images/certificates/bg-cte.png',
  '/images/certificates/blueberry-certificate.png',
  '/images/certificates/fintokei-certificate.png',
  '/images/certificates/fivers-certificate.jpg',
  '/images/certificates/brightfunded-certificate.png',
  '/images/certificates/bg-cte.jpg',
  
  // Дополнительные сертификаты
  '/images/certificates/blue-guardian-certificate.png',
  '/images/certificates/ftmo-certificate.png',
  '/images/certificates/fundingpips-certificate.jpg',
  '/images/certificates/tmo 1.JPEG',
  '/images/certificates/tmo 2.JPEG',
  '/images/certificates/tmo 3.JPEG',
  '/images/certificates/tmo 4.JPEG',
  '/images/certificates/tmo 5.JPEG',
  '/images/certificates/tmo 6.JPEG',
  
  // Логотипы
  '/images/logo/yyps-logo.jpg',
  '/images/logo/Tgo.jpg',
  
  // Криптовалюты
  '/images/crypto/usdt.png',
  '/images/crypto/usdc.png',
  
  // Сети
  '/images/networks/bep20.png',
  '/images/networks/polygon.png',
  '/images/networks/arbitrum.png',
  '/images/networks/optimism.png'
];

export const useImagePreloader = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;
    const loadedImagesList: string[] = [];

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          loadedCount++;
          loadedImagesList.push(src);
          setLoadedImages([...loadedImagesList]);
          setLoadingProgress((loadedCount / totalImages) * 100);
          
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Не удалось загрузить изображение: ${src}`);
          loadedCount++;
          setLoadingProgress((loadedCount / totalImages) * 100);
          
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve(); // Продолжаем даже если изображение не загрузилось
        };
        
        img.src = src;
      });
    };

    // Начинаем предварительную загрузку всех изображений
    const startPreloading = async () => {
      console.log('🚀 Начинаем предварительную загрузку изображений...');
      
      try {
        await Promise.all(imagesToPreload.map(preloadImage));
        console.log('✅ Все изображения успешно предзагружены!');
      } catch (error) {
        console.error('❌ Ошибка при предварительной загрузке изображений:', error);
      }
    };

    startPreloading();

    // Очистка не требуется, так как изображения остаются в кэше браузера
  }, []);

  return {
    imagesLoaded,
    loadingProgress,
    loadedImages,
    totalImages: imagesToPreload.length
  };
};

export default useImagePreloader;