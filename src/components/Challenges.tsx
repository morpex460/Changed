import React from 'react';
import { CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

const Challenges = () => {
  const challengeResults = [
    {
      step: "1",
      title: "Первый вызов",
      description: "Прошли с результатом +15.2%",
      status: "completed",
      profit: "+$1,526.40",
      company: "FTMO"
    },
    {
      step: "2", 
      title: "Верификация",
      description: "Подтвердили стабильность стратегии",
      status: "completed",
      profit: "+$3,878.00",
      company: "Blue Guardian"
    },
    {
      step: "3",
      title: "Реальная торговля",
      description: "Получили первые выплаты",
      status: "completed",
      profit: "+$2,645.60",
      company: "Blueberry.Funded"
    },
    {
      step: "4",
      title: "Масштабирование",
      description: "Увеличили капитал до $100,000",
      status: "completed", 
      profit: "+$1,299.00",
      company: "Fintokei"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Сколько вызовов нужно для получения финансирования?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наш подход позволяет проходить вызовы с первого раза. Вот реальный путь к успеху.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>

          <div className="space-y-12">
            {challengeResults.map((challenge, index) => (
              <div key={index} className="relative flex items-center">
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 ml-auto text-left'}`}>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span className={`font-bold text-gray-900 text-lg ${index % 2 === 0 ? 'mr-2' : 'ml-2'}`}>
                          Этап {challenge.step}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-600 font-bold text-lg">
                        {challenge.profit}
                      </div>
                      <div className="text-gray-500 text-sm font-medium">
                        {challenge.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-2xl mx-auto">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Результат: 100% успех
            </h3>
            <p className="text-gray-600 mb-4">
              Все 4 вызова пройдены с первого раза благодаря нашей проверенной стратегии
            </p>
            <div className="flex items-center justify-center text-green-600 font-bold text-xl">
              <DollarSign className="h-6 w-6 mr-1" />
              Общая прибыль: $9,349
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
