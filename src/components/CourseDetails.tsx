import React from 'react';
import { Play, Target, DollarSign, Eye, BookOpen } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const CourseDetails = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <Play className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />,
      number: "20",
      title: "Video Lessons",
      description: "Comprehensive video content covering all aspects of prop firm trading",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />,
      number: "4",
      title: "Challenge Strategies",
      description: "Proven strategies specifically designed for passing evaluation challenges",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <DollarSign className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />,
      number: "2",
      title: "Funded Account Strategies",
      description: "Advanced strategies for maximizing profits on funded accounts",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Eye className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />,
      number: "∞",
      title: "Hidden Rules Analysis",
      description: "Complete breakdown of unwritten rules and evaluation criteria",
      color: "from-red-500 to-red-600"
    }
  ];

  const bonusContent = [
    "Live trading session recordings",
    "Risk management calculators",
    "Lot size calculation tools",
    "Challenge tracking templates",
    "Psychology worksheets",
    "Platform setup guides"
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            What You Get in the Group
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            A complete trading education package with everything you need to succeed in prop firm challenges
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16 lg:w-20 lg:h-20'} mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold text-gray-900 mb-2`}>
                {feature.number}
              </div>
              
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-2 lg:mb-3`}>
                {feature.title}
              </h3>
              
              <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
