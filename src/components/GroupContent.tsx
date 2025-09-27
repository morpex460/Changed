import React from 'react';
import { Eye, Calculator, Building, Monitor, Trophy, DollarSign } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const GroupContent = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <Eye className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Hidden Rules Breakdown",
      description: "Detailed analysis of unwritten rules that can make or break your challenge"
    },
    {
      icon: <Calculator className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Real Statistics",
      description: "Analyzing real statistics, not made-up numbers"
    },
    {
      icon: <Building className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Prop Firms Overview",
      description: "Comprehensive analysis of top proprietary trading companies"
    },
    {
      icon: <Monitor className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Monitoring Group",
      description: "Detailed monitoring and control of the trading activities of group members."
    },
    {
      icon: <Trophy className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Challenge Passing Strategies",
      description: "Proven methods to pass evaluation challenges consistently"
    },
    {
      icon: <DollarSign className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />,
      title: "Funded Account Trading",
      description: "Advanced strategies for maximizing profits on funded accounts"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            What's Inside My Trading Group
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Get exclusive access to insider knowledge, advanced strategies, and real-time monitoring 
            that separates successful traders from the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg border border-gray-200 group"
            >
              <div className="text-blue-600 mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 lg:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroupContent;
