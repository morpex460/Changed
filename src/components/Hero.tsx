import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Импортируем useNavigate

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const payoutSlides = [
    {
      image: "/images/certificates/tmo 6.JPEG",
      company: "FTMO",
      amount: "$8,679.34"
    },
    {
      image: "/images/certificates/bg 1.jpg", 
      company: "Blue Guardian",
      amount: "$5,285.00"
    },
    {
      image: "/images/certificates/bf 8.jpg",
      company: "Blueberry Funded", 
      amount: "$7,638.20"
    },
    {
      image: "/images/certificates/in 1.jpg",
      company: "Instant Funding",
      amount: "$8,223.20"
    },
    {
      image: "/images/certificates/tmo 7.JPEG",
      company: "FTMO",
      amount: "$4,073.84"
    },
    {
      image: "/images/certificates/bg-cte.jpg", 
      company: "Blue Guardian",
      amount: "$3,878.00"
    },
    {
      image: "/images/certificates/bf 7.jpg",
      company: "Blueberry Funded", 
      amount: "$6,044.80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % payoutSlides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-16 bg-gradient-to-b from-gray-50 to-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                How to Get
                <span className="text-blue-600 block">Payouts</span>
                from Prop Firms
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Discover the secrets of successful trading and receiving stable payouts from leading proprietary companies. 
                My strategies for challenges and funded accounts guarantee success.
              </p>
            </div>

             <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button 
               onClick={() => navigate('/wallet')}
                className="bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition-all font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join Now
              </button>
              <button 
                onClick={() => document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-gray-300 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold text-base sm:text-lg transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Start Learning
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-6 sm:space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">$100,000+</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">20+</div>
                <div className="text-xs sm:text-sm text-gray-600">Successful Challenges</div>
              </div>
            </div>
          </div>

          {/* Payout Slider */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              <div className={`relative ${isMobile ? 'h-48 sm:h-64' : 'h-80'} overflow-hidden rounded-lg`}>
                {payoutSlides.map((slide, index) => (
                  <img
                    key={index}
                    src={slide.image}
                    alt={`${slide.company} payout certificate`}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Company info below image */}
            <div className="text-center mt-4 lg:mt-6 p-3 sm:p-4 bg-white rounded-lg shadow-lg">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                {payoutSlides[currentSlide].amount}
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600">
                {payoutSlides[currentSlide].company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
