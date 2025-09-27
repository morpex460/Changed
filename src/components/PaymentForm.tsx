import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, ArrowRight, AlertTriangle, Smartphone } from 'lucide-react';
import { CryptoCurrency, PaymentAddress } from '../types/wallet';
import { createPaymentAddress, copyToClipboard, formatCryptoAmount, formatUSDAmount, calculateCryptoAmount, getSubscriptionPrice } from '../utils/crypto';

interface PaymentFormProps {
  currency: CryptoCurrency;
  onPaymentAddressGenerated: (paymentAddress: PaymentAddress) => void;
  isLoading: boolean;
  preventAutoGeneration?: boolean;
  onClearPreventAutoGeneration?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  currency,
  onPaymentAddressGenerated,
  isLoading,
  preventAutoGeneration = false,
  onClearPreventAutoGeneration,
}) => {
  const [paymentAddress, setPaymentAddress] = useState<PaymentAddress | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Payment amount (equivalent to subscription price)
  const usdAmount = getSubscriptionPrice();
  const amount = calculateCryptoAmount(usdAmount, currency);

  useEffect(() => {
    if (!preventAutoGeneration) {
      console.log('PaymentForm: автоматическая генерация адреса разрешена');
      generateAddress();
    } else {
      console.log('PaymentForm: автоматическая генерация адреса предотвращена preventAutoGeneration=true');
    }
  }, [currency, preventAutoGeneration]);

  const generateAddress = async () => {
    setIsGenerating(true);
    
    // Очищаем флаг preventAutoGeneration при ручной генерации
    if (preventAutoGeneration && onClearPreventAutoGeneration) {
      console.log('PaymentForm: очистка флага preventAutoGeneration перед генерацией');
      onClearPreventAutoGeneration();
    }
    
    try {
      const address = await createPaymentAddress(currency, amount);
      setPaymentAddress(address);
      onPaymentAddressGenerated(address);
    } catch (error) {
      console.error('Error generating address:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAddress = async () => {
    if (paymentAddress?.address) {
      const success = await copyToClipboard(paymentAddress.address);
      if (success) {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
    }
  };

  const handleCopyAmount = async () => {
    const success = await copyToClipboard(amount.toString());
    if (success) {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleProceedToMonitoring = () => {
    if (paymentAddress) {
      onPaymentAddressGenerated(paymentAddress);
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Payment Address</h3>
        <p className="text-gray-600">Creating your unique payment address...</p>
      </div>
    );
  }

  if (!paymentAddress) {
    if (preventAutoGeneration) {
      return (
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
          <QrCode className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Payment Address</h3>
          <p className="text-gray-600 mb-4">Click the button below to generate your unique payment address for {currency.symbol} ({currency.network})</p>
          <button
            onClick={generateAddress}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Generate Payment Address
          </button>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Address Generation Error</h3>
          <p className="text-gray-600 mb-4">Failed to create payment address</p>
          <button
            onClick={generateAddress}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Payment Details */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-normal py-2">
            Send {currency.symbol} Payment
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Scan the QR code or copy the address to make your payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-3xl border-2 border-blue-200 inline-block mb-4 shadow-lg">
              {paymentAddress.qrCode ? (
                <img
                  src={paymentAddress.qrCode}
                  alt="Payment QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gray-100 flex items-center justify-center rounded-xl">
                  <QrCode className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
              <Smartphone className="h-4 w-4 text-blue-500" />
              <span>Scan with your phone camera</span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            {/* Amount */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Amount</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Cryptocurrency:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {formatCryptoAmount(amount, currency.symbol)} {currency.symbol}
                    </div>
                    <button
                      onClick={handleCopyAmount}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1 mt-1"
                    >
                      {copiedAmount ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Amount</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-green-200 pt-3">
                  <span className="text-gray-600 font-medium">USD Equivalent:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatUSDAmount(usdAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Address</h3>
              <div className="space-y-6">
                {/* Network Information */}
                <div className="bg-white rounded-xl p-6 border-2 border-blue-300 shadow-lg">
                  <div className="text-base text-gray-700 mb-3 font-semibold">
                    Network: {currency.network}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Make sure your wallet supports this network
                  </div>
                  <div className="text-base text-gray-700 mb-4 font-medium">
                    Recipient Address:
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="font-mono text-base text-gray-900 break-all bg-gray-50 p-4 rounded-lg border flex-1">
                      {paymentAddress.address}
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-all hover:scale-105 shadow-md"
                      title="Copy address"
                    >
                      {copiedAddress ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Expected Amount */}
                <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-lg">
                  <div className="text-base text-gray-700 mb-3 font-semibold">
                    Expected Amount:
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {formatCryptoAmount(amount, currency.symbol)} {currency.symbol}
                      </div>
                      <div className="text-lg text-gray-600">
                        ({formatUSDAmount(usdAmount)})
                      </div>
                    </div>
                    <button
                      onClick={handleCopyAmount}
                      className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all hover:scale-105 shadow-md flex items-center space-x-2"
                      title="Copy amount"
                    >
                      {copiedAmount ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm font-medium">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Network Info */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div className="text-base">
                  <div className="font-bold text-orange-900 mb-4 text-lg">Important Network Information:</div>
                  <ul className="text-orange-800 space-y-3 font-medium">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Send only {currency.symbol} to this address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Selected Network:</strong> {currency.network}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Minimum amount: {formatCryptoAmount(amount * 0.99, currency.symbol)} {currency.symbol}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Processing time: {currency.processingTime}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Network fees: {currency.fees}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Warning:</strong> Wrong network = permanent loss of funds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8 text-center leading-normal py-2">
          How to Complete Payment
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 font-bold text-base sm:text-lg lg:text-xl shadow-lg flex-shrink-0">
              1
            </div>
            <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 text-xs sm:text-sm lg:text-lg text-center">Open Your Wallet</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight text-center px-1">
              Launch your cryptocurrency wallet or exchange platform
            </p>
          </div>
          
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-purple-50 rounded-xl sm:rounded-2xl border border-purple-100 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 font-bold text-base sm:text-lg lg:text-xl shadow-lg flex-shrink-0">
              2
            </div>
            <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 text-xs sm:text-sm lg:text-lg text-center">Send {currency.symbol}</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight text-center px-1">
              Transfer the exact amount to the provided address
            </p>
          </div>
          
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 font-bold text-base sm:text-lg lg:text-xl shadow-lg flex-shrink-0">
              3
            </div>
            <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 text-xs sm:text-sm lg:text-lg text-center">Get Access</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight text-center px-1">
              Your subscription activates automatically after confirmation
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-center text-white">
        <p className="text-blue-100 mb-6 text-lg">
          After sending your cryptocurrency, click below to track your transaction
        </p>
        <button
          onClick={handleProceedToMonitoring}
          className="bg-white text-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-3 mx-auto"
        >
          <span>I've Sent the Payment</span>
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
