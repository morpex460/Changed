import React from 'react';
import { Check, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

const MembershipPlans = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGetFullAccess = () => {
    navigate('/wallet');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const plans = [
    {
      name: "Free Version",
      price: "Free",
      period: "Trial Access",
      description: "Basic knowledge for understanding group structure",
      features: [
        "Surface-level introduction to the group",
        "Group content breakdown", 
        "5 Lessons from the Full group",
        "Limited access to materials"
      ],
      limitations: [
        "No Hidden Rules Analysis",
        "No Four Challenge Strategies",
        "No Two Funded Strategies",
        "No Monitoring group",
        "No Prop Firms Overwiew"
      ],
      buttonText: "Try for Free",
      buttonLink: "https://discord.gg/h4qPr7UXZ9", // 🔗 добавляем сюда ссылку на Discord
      popular: false,
      buttonStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50"
    },
    {
      name: "Full Version", 
      price: "$499",
      period: "Lifetime Access",
      description: "Complete system for professional completion of prop challenges and receiving payouts",
      features: [
        "Full content of the group",
        "All 20 lessons",
        "Unlimited access to updates",
        "Hidden Rules Analysis",
        "Four Challenge Strategies",
        "Two Funded Strategies",
        "Access to the monitoring group",
        "Prop Firms Overwiew",
        "Analysis of real statistics",
        "Access to the group for tracking new rules"
      ],
      limitations: [],
      buttonText: "Get Full Access",
      popular: true,
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    }
  ];

  return (
    <section id="membership" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Choose Your Learning Plan
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Start with the free version or get full access to all materials and strategies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 sm:p-6 lg:p-8 ${
                plan.popular && !isMobile
                  ? 'ring-2 ring-gray-900 shadow-2xl transform scale-105' 
                  : plan.popular && isMobile
                  ? 'ring-2 ring-gray-900 shadow-2xl'
                  : 'shadow-lg'
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="flex items-center justify-center mb-3 lg:mb-4">
                  <span className="bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Recommended
                  </span>
                </div>
              )}

              <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6 lg:mb-8'}`}>
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold text-gray-900 mb-2`}>{plan.name}</h3>
                <div className="mb-2">
                  <span className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-bold text-gray-900`}>{plan.price}</span>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} text-gray-600 mb-2 lg:mb-4`}>{plan.period}</p>
                <p className={`${isMobile ? 'text-xs leading-tight' : 'text-sm sm:text-base'} text-gray-600`}>{plan.description}</p>
              </div>

              <div className={`${isMobile ? 'space-y-2 mb-4' : 'space-y-3 lg:space-y-4 mb-6 lg:mb-8'}`}>
                <h4 className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>What's included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className={`${isMobile ? 'h-3 w-3 mr-2 mt-1' : 'h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5'} text-green-500 flex-shrink-0`} />
                    <span className={`${isMobile ? 'text-xs leading-tight' : 'text-xs sm:text-sm lg:text-base'} text-gray-600`}>{feature}</span>
                  </div>
                ))}

                {plan.limitations.length > 0 && (
                  <>
                    <h4 className={`font-semibold text-gray-900 ${isMobile ? 'mt-3 text-xs' : 'mt-4 lg:mt-6 text-sm sm:text-base'}`}>Limitations:</h4>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start">
                        <X className={`${isMobile ? 'h-3 w-3 mr-2 mt-1' : 'h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5'} text-red-500 flex-shrink-0`} />
                        <span className={`${isMobile ? 'text-xs leading-tight' : 'text-xs sm:text-sm lg:text-base'} text-gray-500`}>{limitation}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Кнопки */}
              {plan.buttonText === "Get Full Access" ? (
                <button
                  onClick={handleGetFullAccess}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 ${plan.buttonStyle} shadow-lg hover:shadow-xl ${!isMobile ? 'transform hover:-translate-y-1' : ''}`}
                >
                  {plan.buttonText}
                </button>
              ) : (
                <a
                  href={plan.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 ${plan.buttonStyle} shadow-lg hover:shadow-xl ${!isMobile ? 'transform hover:-translate-y-1' : ''}`}
                >
                  {plan.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            <strong>Why the Full Version is worth it:</strong> The difference between surface knowledge and 
            professional system is the difference between failures and stable payouts of $100,000+
          </p>
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
