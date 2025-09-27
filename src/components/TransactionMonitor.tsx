import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Shield, Zap, Copy } from 'lucide-react';
import { PaymentAddress, Transaction } from '../types/wallet';
import { checkTransactionStatus, formatCryptoAmount, formatUSDAmount } from '../utils/crypto';

interface TransactionMonitorProps {
  paymentAddress: PaymentAddress;
  transaction?: Transaction;
  onTransactionDetected: (transaction: Transaction) => void;
  onPaymentSuccess: () => void;
}

const TransactionMonitor: React.FC<TransactionMonitorProps> = ({
  paymentAddress,
  transaction,
  onTransactionDetected,
  onPaymentSuccess,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(transaction || null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const checkForTransaction = async () => {
      setIsChecking(true);
      setLastChecked(new Date());

      try {
        const result = await checkTransactionStatus(paymentAddress.address, paymentAddress.currency) as any;
        
        if (result.confirmed && !currentTransaction) {
          // Обнаружена новая транзакция
          const newTransaction: Transaction = {
            id: `tx_${Date.now()}`,
            txHash: result.txHash,
            currency: paymentAddress.currency,
            amount: paymentAddress.amount || 0,
            usdAmount: paymentAddress.usdAmount || 0,
            status: 'confirmed',
            timestamp: new Date(),
            confirmations: result.confirmations,
            requiredConfirmations: 3,
          };

          setCurrentTransaction(newTransaction);
          onTransactionDetected(newTransaction);

          // Если достаточно подтверждений, активируем подписку
          if (result.confirmations >= 3) {
            setTimeout(() => {
              onPaymentSuccess();
            }, 2000);
          }
        } else if (currentTransaction && result.confirmed) {
          // Обновляем существующую транзакцию
          const updatedTransaction: Transaction = {
            ...currentTransaction,
            confirmations: result.confirmations,
            status: (result.confirmations >= 3 ? 'confirmed' : 'pending') as 'pending' | 'confirmed' | 'failed',
          };

          setCurrentTransaction(updatedTransaction);

          if (result.confirmations >= 3 && currentTransaction.status === 'pending') {
            setTimeout(() => {
              onPaymentSuccess();
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Первоначальная проверка
    checkForTransaction();

    // Регулярные проверки каждые 30 секунд
    checkInterval = setInterval(checkForTransaction, 30000);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [paymentAddress, currentTransaction, onTransactionDetected, onPaymentSuccess]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Убрали уведомление по требованию пользователя
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Information - MOVED TO TOP AND ENLARGED */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 shadow-2xl border-2 border-blue-200">
        <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center">Payment Information</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-lg text-gray-700 mb-3 font-semibold">Recipient Address</div>
            <div className="relative">
              <div className="font-mono text-lg bg-gray-100 p-4 rounded-xl break-all border-2 border-gray-300 pr-12">
                {paymentAddress.address}
              </div>
              <button
                onClick={() => copyToClipboard(paymentAddress.address, 'Address')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Copy address"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {paymentAddress.currency.network}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-lg text-gray-700 mb-3 font-semibold">Amount to Transfer</div>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-4xl font-bold text-gray-900 mb-2 pr-12">
                  {formatCryptoAmount(paymentAddress.amount || 0, paymentAddress.currency.symbol)} {paymentAddress.currency.symbol}
                </div>
                <button
                  onClick={() => copyToClipboard(`${formatCryptoAmount(paymentAddress.amount || 0, paymentAddress.currency.symbol)}`, 'Amount')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Copy amount"
                >
                  <Copy className="h-6 w-6" />
                </button>
              </div>
              <div className="text-xl text-gray-600 mb-4">
                ≈ {formatUSDAmount(paymentAddress.usdAmount || 0)}
              </div>
              <div className="text-lg text-gray-700 font-semibold">
                Currency: {paymentAddress.currency.name}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4">
            <p className="text-lg font-semibold text-yellow-800">
              ⚠️ Please transfer the EXACT amount to the address above
            </p>
            <p className="text-yellow-700 mt-2">
              Transfers of different amounts won't be detected automatically
            </p>
          </div>
        </div>
      </div>

      {/* Status Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-normal py-2">
            {currentTransaction ? 'Transaction Confirmation' : 'Waiting for payment'}
          </h2>
          <p className="text-xl text-gray-600">
            {currentTransaction 
              ? 'Your transaction has been detected and is being processed'
              : 'Monitoring blockchain for incoming funds'
            }
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center mb-8">
          {currentTransaction ? (
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-full ${getStatusBg(currentTransaction.status)}`}>
              {currentTransaction.status === 'confirmed' ? (
                <CheckCircle className={`h-8 w-8 ${getStatusColor(currentTransaction.status)}`} />
              ) : (
                <Clock className={`h-8 w-8 ${getStatusColor(currentTransaction.status)}`} />
              )}
              <span className={`font-semibold text-lg ${getStatusColor(currentTransaction.status)}`}>
                {currentTransaction.status === 'confirmed' ? 'Confirmed' : 'Awaiting Confirmations'}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-4 px-8 py-4 rounded-full bg-blue-50 border border-blue-200">
              {isChecking ? (
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              ) : (
                <Clock className="h-8 w-8 text-blue-600" />
              )}
              <span className="font-semibold text-lg text-blue-600">Waiting for payment</span>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(timeElapsed)}
          </div>
          <div className="text-lg text-gray-500">
            Time elapsed since waiting started
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {currentTransaction && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Transaction Details</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Amount</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCryptoAmount(currentTransaction.amount, currentTransaction.currency.symbol)} {currentTransaction.currency.symbol}
                </div>
                <div className="text-sm text-gray-500">
                  ≈ {formatUSDAmount(currentTransaction.usdAmount)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className={`font-semibold ${getStatusColor(currentTransaction.status)}`}>
                  {currentTransaction.status === 'confirmed' ? 'Confirmed' : 'Processing'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Time</div>
                <div className="text-gray-900">
                  {currentTransaction.timestamp.toLocaleString('en-US')}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Confirmations</div>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-semibold text-gray-900">
                    {currentTransaction.confirmations} / {currentTransaction.requiredConfirmations}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (currentTransaction.confirmations / currentTransaction.requiredConfirmations) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {currentTransaction.txHash && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Transaction Hash</div>
                  <div className="flex items-center space-x-2">
                    <div className="font-mono text-sm text-gray-900 truncate">
                      {currentTransaction.txHash.substring(0, 20)}...
                    </div>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Network</div>
                <div className="text-gray-900">{currentTransaction.currency.network}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {currentTransaction.confirmations < currentTransaction.requiredConfirmations && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-yellow-900 mb-1">
                    Transaction processing in progress
                  </div>
                  <div className="text-yellow-800">
                    {currentTransaction.requiredConfirmations - currentTransaction.confirmations} more confirmations needed 
                    to complete. This usually takes 5-15 minutes.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}



      {/* Security and Automation Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Security</h4>
              <p className="text-base text-gray-600">
                Secure payment method protected by blockchain cryptography. All transactions are immutable and cannot be forged or reversed.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Zap className="h-8 w-8 text-indigo-600 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Automation</h4>
              <p className="text-base text-gray-600">
                Automatic payment processing. Your subscription will be activated immediately after blockchain confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="text-center text-sm text-gray-500">
        {isChecking && <span>Checking blockchain...</span>}
        {!isChecking && (
          <span>
            Last check: {lastChecked.toLocaleTimeString('en-US')}
          </span>
        )}
      </div>
    </div>
  );
};

export default TransactionMonitor;
