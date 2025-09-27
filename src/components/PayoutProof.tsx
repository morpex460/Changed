import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PayoutProof = () => {
  const [selectedPayout, setSelectedPayout] = useState(null);

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (selectedPayout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Очистка при размонтировании компонента
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPayout]);
  const payouts = [
    {
      company: "FTMO",
      amount: "$21 812.43",
      image: "/images/certificates/tmo 6.JPEG",
      date: "March 2025",
      accountsPurchased: 2,
      fundedAccounts: 1,
      totalPayouts: 21812.43,
      details: {
        purchased: "Purchased 3 accounts at $50k each",
        funded: "Passed challenge on 2 accounts",
        payouts: "Received 1 payout of $1,526.40"
      },
      additionalImages: [
        "/images/certificates/tmo 7.JPEG",
        "/images/certificates/tmo 2.JPEG",
        "/images/certificates/tmo 5.JPEG",
        "/images/certificates/tmo 3.JPEG",
        "/images/certificates/tmo 1.JPEG",
        "/images/certificates/tmo 4.JPEG"
      ]
    },
    {
      company: "Blue Guardian",
      amount: "$3,878.00",
      image: "/images/certificates/blue-guardian-certificate.png",
      date: "February 2025",
      accountsPurchased: 5,
      fundedAccounts: 4,
      totalPayouts: 3878.00,
      details: {
        purchased: "Purchased 5 accounts at $100k each",
        funded: "Passed challenge on 4 accounts",
        payouts: "Received 2 payouts totaling $3,878.00"
      },
      additionalImages: [
        "/images/certificates/blue-guardian-certificate.png",
        "/images/certificates/blue-guardian-certificate.png",
        "/images/certificates/blue-guardian-certificate.png"
      ]
    },
    {
      company: "Blueberry Funded",
      amount: "$35,933.40",
      image:  "/images/certificates/bf 8.jpg",
      date: "October 2024",
      accountsPurchased: 4,
      fundedAccounts: 2,
      totalPayouts: 35933.40,
      details: {
        purchased: "Purchased 4 accounts at $50k each",
        funded: "Passed challenge on 3 accounts",
        payouts: "Received 3 payouts totaling $2,645.60"
      },
      additionalImages: [
        "/images/certificates/bf 7.jpg",
        "/images/certificates/bf 6.jpg",
        "/images/certificates/bf 5.jpg",
        "/images/certificates/bf 4.JPEG", 
        "/images/certificates/bf 3.jpg",
        "/images/certificates/bf 2.JPEG",
        "/images/certificates/bf 1.JPEG"
      ]
    },
    {
      company: "Fintokei",
      amount: "$1,299.00",
      image: "/images/certificates/fintokei-certificate.png",
      date: "November 2024",
      accountsPurchased: 2,
      fundedAccounts: 2,
      totalPayouts: 1299.00,
      details: {
        purchased: "Purchased 2 accounts at $25k each",
        funded: "Passed challenge on 2 accounts",
        payouts: "Received 1 payout of $1,299.00"
      },
      additionalImages: [
        "/images/certificates/fintokei-certificate.png"
      ]
    }
  ];

  const totalAmount = payouts.reduce((sum, payout) => {
    return sum + parseFloat(payout.amount.replace('$', '').replace(',', ''));
  }, 0);

  return (
    <section id="payouts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Payout Proof
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our students receive stable payouts from leading proprietary companies. 
            Here are the certificates of our successful payouts.
          </p>
          <div className="inline-flex items-center justify-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold text-lg">
            Total Payouts: $100,000+
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {payouts.map((payout, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedPayout(payout)}
            >
              <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={payout.image}
                  alt={`${payout.company} payout certificate`}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{payout.company}</h3>
                  <span className="text-green-600 font-bold text-xl">{payout.amount}</span>
                </div>
                <p className="text-gray-600 text-sm">{payout.date}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white shadow-lg"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Images Gallery */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                          <img
                            src={selectedPayout.image}
                            alt={`${selectedPayout.company} certificate`}
                            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                          />
                        </div>
                        {selectedPayout.additionalImages?.map((imgSrc, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                            <img
                              src={imgSrc}
                              alt={`${selectedPayout.company} additional certificate ${index + 1}`}
                              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {selectedPayout.company}
                        </h3>
                        <p className="text-xl text-green-600 font-bold">
                          {selectedPayout.amount}
                        </p>
                        <p className="text-gray-600">{selectedPayout.date}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">📊 Statistics</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Purchased accounts:</span>
                              <span className="font-semibold">{selectedPayout.accountsPurchased}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Funded accounts:</span>
                              <span className="font-semibold text-green-600">{selectedPayout.fundedAccounts}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total payouts:</span>
                              <span className="font-semibold text-green-600">${selectedPayout.totalPayouts.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">💡 Success:</span> These results were achieved through our proven trading strategy and strict adherence to risk management rules.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PayoutProof;
