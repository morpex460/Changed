import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AlertTriangle, Brain, Shield, Target, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CourseStructureCarousel = () => {
  const isMobile = useIsMobile();
  
  const courseStructure = [
    {
      id: 1,
      title: "Misconceptions",
      subtitle: "Part 1",
      icon: <AlertTriangle className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      description: "Clear up common trading myths and misconceptions that prevent from",
      details: [
        "Harsh reality",
        "The main myths",
        "Studying the real situation",
        "Different things",
      ],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: 2,
      title: "Psychology",
      subtitle: "Part 2",
      icon: <Brain className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      description: "Master the mental game of trading with proven psychological techniques",
      details: [
        "Real statistics",
        "Faith in the trading strategy",
        "Psychological mistakes",
        "Bad strategies"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      title: "Main and Hidden Rules",
      subtitle: "Part 3",
      icon: <Shield className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      description: "Learn both the obvious and hidden rules that prop firms use to evaluate traders",
      details: [
        "What rules are there?",
        "Your choices/risks",
        "Main rules",
        "Hidden rules"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 4,
      title: "Strategies",
      subtitle: "Part 4",
      icon: <Target className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      description: "4 proven strategies specifically designed for prop firm success",
      details: [
        "How do the strategies differ? Will I lose?",
        "Strategy 1",
        "Strategy 2",
        "Strategy 3-4"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 5,
      title: "How to Work on FUNDED",
      subtitle: "Part 5",
      icon: <Briefcase className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      description: "2 specialized strategies for managing funded accounts effectively",
      details: [
        "How to work on a funded account?",
        "Trading days",
        "Strategies for funded accounts",
        "A few final words"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <section id="course" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Complete Group Structure
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through my comprehensive 5-part curriculum designed to take you from beginner to funded trader
          </p>
        </div>

        <div className="relative pt-4">
         <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={30}
  slidesPerView={1}
  navigation={{
    prevEl: '.swiper-button-prev-custom',
    nextEl: '.swiper-button-next-custom',
  }}
  pagination={{
    clickable: true,
    dynamicBullets: true,
    el: '.swiper-pagination', //
  }}
  onInit={(swiper) => { // Устанавливаем начальное состояние стрелок
    const prevButton = document.querySelector('.swiper-button-prev-custom');
    const nextButton = document.querySelector('.swiper-button-next-custom');

    // Если первый слайд, скрываем левую стрелку
    if (swiper.activeIndex === 0) {
      prevButton?.classList.add('hidden');
    } else {
      prevButton?.classList.remove('hidden');
    }

    // Проверяем достижение конца с учетом количества видимых слайдов
    const currentSlidesPerView = swiper.params.slidesPerView === 'auto' ? 1 : swiper.params.slidesPerView;
    const isLastSlide = swiper.activeIndex + currentSlidesPerView >= swiper.slides.length;
    
    if (isLastSlide) {
      nextButton?.classList.add('hidden');
    } else {
      nextButton?.classList.remove('hidden');
    }
  }}
  onSlideChange={(swiper) => { // Обновляем состояние стрелок при смене слайда
    const prevButton = document.querySelector('.swiper-button-prev-custom');
    const nextButton = document.querySelector('.swiper-button-next-custom');

    // Если первый слайд, скрываем левую стрелку
    if (swiper.activeIndex === 0) {
      prevButton?.classList.add('hidden');
    } else {
      prevButton?.classList.remove('hidden');
    }

    // Получаем текущее количество видимых слайдов с учетом breakpoints
    let currentSlidesPerView = 1; // по умолчанию для мобильных
    
    if (window.innerWidth >= 1024) {
      currentSlidesPerView = 3; // для ноутбуков/десктопов
    } else if (window.innerWidth >= 768) {
      currentSlidesPerView = 2; // для планшетов
    }
    
    // Проверяем достижение конца с учетом количества видимых слайдов
    const isLastSlide = swiper.activeIndex + currentSlidesPerView >= swiper.slides.length;
    
    if (isLastSlide) {
      nextButton?.classList.add('hidden');
    } else {
      nextButton?.classList.remove('hidden');
    }
  }}
  breakpoints={{
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  }}
  className="pb-16"
>
  {courseStructure.map((part) => (
      <SwiperSlide key={part.id}>
                <div className={`${part.bgColor} ${part.borderColor} border-2 rounded-2xl p-4 sm:p-6 lg:p-8 h-full ${isMobile ? 'min-h-[320px]' : 'min-h-[400px]'} hover:shadow-xl transition-all duration-300 group`}>
                  <div className="text-center mb-4 lg:mb-6">
                    <div className={`inline-flex p-3 lg:p-4 rounded-2xl bg-gradient-to-r ${part.color} text-white mb-3 lg:mb-4 ${!isMobile ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                      {part.icon}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 lg:mb-2">
                      {part.subtitle}
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                      {part.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6">
                      {part.description}
                    </p>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    {part.details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-2 lg:space-x-3">
                        <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-gradient-to-r ${part.color} mt-1.5 lg:mt-2 flex-shrink-0`}></div>
                        <span className="text-xs sm:text-sm lg:text-base text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
            <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
            <ChevronRight className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </button>
        </div>
      </div>

      {/* Custom Pagination */}
      <div className="swiper-pagination mt-8" style={{ position: 'relative', bottom: '-10px' }}></div>
    </section>
  );
};

export default CourseStructureCarousel;