import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Shield, Zap, Copy, Wifi, WifiOff } from 'lucide-react';
import { PaymentAddress, Transaction } from '../types/wallet';
import { PaymentSession } from '../types/api';
import { formatCryptoAmount, formatUSDAmount, createPaymentSession, checkBackendAvailability } from '../utils/crypto';
import { apiClient } from '../lib/apiClient';
import { websocketClient } from '../lib/websocketClient';
import { blockchainMonitorFixed, TransactionResult } from '../services/BlockchainMonitorFixed';
import { enhancedBlockchainMonitor } from '../services/EnhancedBlockchainMonitor';

interface TransactionMonitorProps {
  paymentAddress: PaymentAddress;
  transaction?: Transaction;
  onTransactionDetected: (transaction: Transaction) => void;
  onPaymentSuccess: () => void;
}

const TransactionMonitorUpdated: React.FC<TransactionMonitorProps> = ({
  paymentAddress,
  transaction,
  onTransactionDetected,
  onPaymentSuccess,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(transaction || null);
  const [currentSession, setCurrentSession] = useState<PaymentSession | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [backendConnected, setBackendConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Обработка найденной транзакции
  const handleTransactionFound = useCallback((txResult: TransactionResult) => {
    console.log('🎉 Транзакция найдена!', txResult);
    
    // Определяем требуемое количество подтверждений в зависимости от сети
    const selectedNetwork = getNetworkFromCurrency(paymentAddress.currency.id);
    let requiredConfirmations = 10; // По умолчанию
    
    // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ для BEP20 и быстрых сетей
    switch (selectedNetwork) {
      case 'bsc':        // BEP20 - быстрая сеть
      case 'polygon':    // Polygon - быстрая сеть
      case 'arbitrum':   // Arbitrum - L2 сеть
      case 'optimism':   // Optimism - L2 сеть  
        requiredConfirmations = 3; // Уменьшенное требование для быстрых/L2 сетей
        break;
      case 'ethereum':   // Ethereum mainnet
        requiredConfirmations = 6; // Средние требования для Ethereum
        break;
    }
    
    console.log(`📊 [${selectedNetwork}] Required confirmations: ${requiredConfirmations}`);
    
    const isConfirmed = txResult.confirmations >= requiredConfirmations;
    
    const newTransaction: Transaction = {
      id: txResult.hash,
      txHash: txResult.hash,
      currency: paymentAddress.currency,
      amount: txResult.value,
      usdAmount: txResult.value, // Для USDT 1:1
      status: isConfirmed ? 'confirmed' : 'pending',
      timestamp: new Date(txResult.timestamp),
      confirmations: txResult.confirmations,
      requiredConfirmations: requiredConfirmations,
    };
    
    setCurrentTransaction(newTransaction);
    onTransactionDetected(newTransaction);
    
    console.log(`🔍 Статус транзакции: ${newTransaction.status} (${txResult.confirmations}/${requiredConfirmations} подтверждений)`);
    
    // ИСПРАВЛЕНИЕ BEP20: Немедленная активация для подтвержденных транзакций в быстрых сетях
    if (newTransaction.status === 'confirmed') {
      console.log(`✅ [${selectedNetwork}] Транзакция подтверждена! Активация подписки...`);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000); // Уменьшенная задержка для быстрых сетей
    } else if (['bsc', 'polygon'].includes(selectedNetwork) && txResult.confirmations >= 1) {
      // Для BEP20/Polygon: активация уже после 1 подтверждения (практически мгновенно)
      console.log(`🚀 [${selectedNetwork}] Быстрая активация после 1 подтверждения!`);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }
    
  }, [paymentAddress, onTransactionDetected, onPaymentSuccess]);

  // Мониторинг подтверждений для найденной транзакции
  const monitorTransactionConfirmations = useCallback(async () => {
    if (!currentTransaction || currentTransaction.status === 'confirmed') return;
    
    const selectedNetwork = getNetworkFromCurrency(paymentAddress.currency.id);
    const token = paymentAddress.currency.symbol as 'USDT';
    
    try {
      console.log(`🔄 Проверка подтверждений для транзакции ${currentTransaction.txHash}`);
      
      const txResult = await blockchainMonitorFixed.verifyTransactionByHash(
        currentTransaction.txHash,
        paymentAddress.address,
        paymentAddress.amount || 5,
        selectedNetwork,
        token
      );
      
      if (txResult && txResult.isValid && txResult.confirmations !== currentTransaction.confirmations) {
        console.log(`📈 Обновление подтверждений: ${txResult.confirmations}/${currentTransaction.requiredConfirmations}`);
        
        const isNowConfirmed = txResult.confirmations >= currentTransaction.requiredConfirmations;
        
        const updatedTransaction: Transaction = {
          ...currentTransaction,
          confirmations: txResult.confirmations,
          status: isNowConfirmed ? 'confirmed' : 'pending'
        };
        
        setCurrentTransaction(updatedTransaction);
        
        // Если достигли требуемое количество подтверждений
        if (updatedTransaction.status === 'confirmed' && currentTransaction.status !== 'confirmed') {
          const network = getNetworkFromCurrency(paymentAddress.currency.id);
          console.log(`✅ [${network}] Транзакция подтверждена! Активация подписки...`);
          
          // Быстрая активация для быстрых сетей
          const delay = ['bsc', 'polygon'].includes(network) ? 1000 : 2000;
          setTimeout(() => {
            onPaymentSuccess();
          }, delay);
        }
      }
    } catch (error) {
      console.error('❌ Ошибка при проверке подтверждений:', error);
    }
  }, [currentTransaction, paymentAddress, onPaymentSuccess]);

  // Initialize payment session (real mode only)
  const initializePaymentSession = useCallback(async () => {
    try {
      setError(null);
      setIsChecking(true);

      // Create real session without backend dependency
      console.log('🚀 Initializing real multi-network blockchain monitoring');
      setCurrentSession({
        id: 'real_session_' + Date.now(),
        address: paymentAddress.address,
        currency: paymentAddress.currency.symbol as 'USDT',
        network: getNetworkIdFromCurrency(paymentAddress.currency.id),
        amount: paymentAddress.amount || 0,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      });
      
      setBackendConnected(true); // Mark as connected to real system
      
      setIsChecking(false);

    } catch (error) {
      console.error('Session initialization error:', error);
      setError(`Session creation error: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  }, [paymentAddress]);

  // Подключение к WebSocket
  const connectWebSocket = useCallback(async (sessionId: string) => {
    try {
      await websocketClient.connect();
      setWebsocketConnected(true);

      // Subscribe to session updates
      websocketClient.subscribeToSession(sessionId, (message) => {
        console.log('Получено WebSocket сообщение:', message);

        switch (message.type) {
          case 'transaction_detected':
            if (message.data && message.data.transaction) {
              const newTransaction: Transaction = {
                id: message.data.transaction.hash,
                txHash: message.data.transaction.hash,
                currency: paymentAddress.currency,
                amount: paymentAddress.amount || 0,
                usdAmount: paymentAddress.usdAmount || 0,
                status: 'pending',
                timestamp: new Date(),
                confirmations: message.data.transaction.confirmations,
                requiredConfirmations: message.data.transaction.requiredConfirmations || 10,
              };
              setCurrentTransaction(newTransaction);
              onTransactionDetected(newTransaction);
            }
            break;

          case 'transaction_confirmed':
            if (currentTransaction && message.data && message.data.transaction) {
              const confirmedTransaction: Transaction = {
                ...currentTransaction,
                status: 'confirmed',
                confirmations: message.data.transaction.confirmations,
              };
              setCurrentTransaction(confirmedTransaction);
              
              // Start subscription activation process
              setTimeout(() => {
                onPaymentSuccess();
              }, 2000);
            }
            break;

          case 'session_expired':
            setError('Сессия платежа истекла. Пожалуйста, создайте новую.');
            break;

          case 'session_update':
            if (message.data && message.data.session) {
              setCurrentSession(message.data.session);
            }
            break;
        }
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      setWebsocketConnected(false);
    }
  }, [currentTransaction, onTransactionDetected, onPaymentSuccess, paymentAddress]);

  // Periodic session status check (works with backend and in simulation mode)
  const checkSessionStatus = useCallback(async () => {
    if (!currentSession) return;

    try {
      setLastChecked(new Date());
      
      // If backend connected, use real API
      if (backendConnected) {
        const updatedSession = await apiClient.getPaymentSession(currentSession.id);
        setCurrentSession(updatedSession);

        // Если обнаружена транзакция и её ещё нет локально
        if (updatedSession.transaction && !currentTransaction) {
          const newTransaction: Transaction = {
            id: updatedSession.transaction.hash,
            txHash: updatedSession.transaction.hash,
            currency: paymentAddress.currency,
            amount: paymentAddress.amount || 0,
            usdAmount: paymentAddress.usdAmount || 0,
            status: updatedSession.transaction.status === 'confirmed' ? 'confirmed' : 'pending',
            timestamp: new Date(updatedSession.transaction.timestamp),
            confirmations: updatedSession.transaction.confirmations,
            requiredConfirmations: updatedSession.transaction.requiredConfirmations,
          };

          setCurrentTransaction(newTransaction);
          onTransactionDetected(newTransaction);

          if (updatedSession.status === 'confirmed') {
            setTimeout(() => {
              onPaymentSuccess();
            }, 2000);
          }
        }
      } else {
        // В режиме симуляции просто обновляем время последней проверки
        console.log('Simulation: Session status check');
      }

    } catch (error) {
      console.error('Session status check error:', error);
    }
  }, [currentSession, currentTransaction, backendConnected, paymentAddress, onTransactionDetected, onPaymentSuccess]);

  // Enhanced blockchain monitoring for SELECTED network only
  const startRealBlockchainMonitoring = useCallback(async () => {
    if (!currentSession) return;
    
    console.log('🚀 Starting blockchain monitoring for SELECTED network only');
    console.log('📍 Monitoring address:', paymentAddress.address);
    console.log('💰 Expected amount:', paymentAddress.amount || 5, paymentAddress.currency.symbol);
    console.log('🌐 Selected network:', paymentAddress.currency.network);
    console.log('🆔 Currency ID:', paymentAddress.currency.id);
    
    try {
      // Determine token type (USDT)
      const token = paymentAddress.currency.symbol as 'USDT';
      console.log(`🪙 Token type: ${token}`);
      
      // Get the specific network from the selected currency
      const selectedNetwork = getNetworkFromCurrency(paymentAddress.currency.id);
      console.log(`🎯 CRITICAL: Monitoring ${token} ONLY on ${selectedNetwork.toUpperCase()} network`);
      console.log(`📊 Network will check last 500 blocks for L2 networks (Optimism/Arbitrum)`);
      
      // Start monitoring only on the selected network
      console.log(`🔍 Starting ${token} monitoring on ${selectedNetwork} network with enhanced block range`);
      await blockchainMonitorFixed.monitorTokenTransfers(
        paymentAddress.address,
        paymentAddress.amount || 5,
        selectedNetwork,
        token,
        (txResult) => {
          console.log(`✅ TRANSACTION FOUND on ${selectedNetwork.toUpperCase()}:`, txResult);
          console.log(`💰 Amount: ${txResult.value} ${token}`);
          console.log(`🔗 Hash: ${txResult.hash}`);
          console.log(`📊 Confirmations: ${txResult.confirmations}`);
          handleTransactionFound(txResult);
        }
      );
      
      console.log(`🎯 SUCCESS: Monitoring initiated for ${selectedNetwork.toUpperCase()} network`);
      console.log(`⏰ Checking every 10 seconds with 500 block depth for L2 networks`);
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR starting blockchain monitoring:', error);
      console.error('❌ Error details:', error.message);
      setError(`Critical error: ${error.message}`);
    }
    
  }, [currentSession, paymentAddress, handleTransactionFound]);

  // Enhanced network detection from currency ID with detailed logging
  const getNetworkFromCurrency = (currencyId: string): 'polygon' | 'bsc' | 'ethereum' | 'arbitrum' | 'optimism' => {
    const id = currencyId.toLowerCase();
    console.log(`🔍 Network detection for currency ID: "${currencyId}" (lowercase: "${id}")`);
    
    // Comprehensive network mapping with detailed logging
    if (id.includes('polygon')) {
      console.log(`✅ Detected POLYGON network from ID: ${currencyId}`);
      return 'polygon';
    }
    if (id.includes('bsc') || id.includes('bep20')) {
      console.log(`✅ Detected BSC network from ID: ${currencyId}`);
      return 'bsc';
    }
    if (id.includes('arbitrum') || id.includes('arb')) {
      console.log(`✅ Detected ARBITRUM network from ID: ${currencyId}`);
      return 'arbitrum';
    }
    if (id.includes('optimism') || id.includes('op')) {
      console.log(`✅ Detected OPTIMISM network from ID: ${currencyId}`);
      return 'optimism';
    }
    if (id.includes('ethereum') || id.includes('erc20') || id.includes('eth')) {
      console.log(`✅ Detected ETHEREUM network from ID: ${currencyId}`);
      return 'ethereum';
    }
    
    // Default fallback to ethereum with warning
    console.log(`⚠️ UNKNOWN network in currency ID: ${currencyId}, defaulting to ethereum`);
    console.log(`⚠️ This may cause monitoring issues for L2 networks!`);
    return 'ethereum';
  };
  
  // Get all supported networks for a token
  const getAllSupportedNetworks = (token: 'USDT'): ('polygon' | 'bsc' | 'ethereum' | 'arbitrum' | 'optimism')[] => {
    // USDT is supported on all these networks
    return ['polygon', 'bsc', 'ethereum', 'arbitrum', 'optimism'];
  };

  // Fallback monitoring for selected network only
  const startFallbackMonitoring = useCallback(async () => {
    const selectedNetwork = getNetworkFromCurrency(paymentAddress.currency.id);
    console.log(`🔄 Starting fallback monitoring for ${selectedNetwork} network only...`);
    
    // Fallback monitoring every 30 seconds
    const checkInterval = setInterval(async () => {
      try {
        setLastChecked(new Date());
        
        // Check for test transaction ID in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const testTxId = urlParams.get('txid');
        
        if (testTxId) {
          console.log('🧪 Found test txid in URL:', testTxId);
          
          const token = paymentAddress.currency.symbol as 'USDT';
          
          // Check transaction only on the selected network
          try {
            console.log(`🔍 Checking transaction ${testTxId} on ${selectedNetwork} network`);
            const txResult = await blockchainMonitorFixed.verifyTransactionByHash(
              testTxId,
              paymentAddress.address,
              paymentAddress.amount || 5,
              selectedNetwork,
              token
            );
            
            if (txResult && txResult.isValid) {
              console.log(`✅ Valid transaction found on ${selectedNetwork} network!`);
              handleTransactionFound(txResult);
              clearInterval(checkInterval);
              return;
            }
          } catch (networkError) {
            console.log(`❌ Failed to verify on ${selectedNetwork}:`, networkError);
          }
        }
        
      } catch (error) {
        console.error('Error in fallback monitoring:', error);
      }
    }, 30000);
    
    // Cleanup on unmount
    return () => clearInterval(checkInterval);
    
  }, [paymentAddress, handleTransactionFound]);

  // Get network ID from currency ID (legacy function)
  const getNetworkIdFromCurrency = (currencyId: string): string => {
    const mapping: Record<string, string> = {
      'tether-erc20': 'erc20',
      'tether-bsc': 'bep20',
      'tether-trc20': 'trc20',
      'tether-arbitrum': 'arbitrum',
      'tether-optimism': 'optimism',
      'tether-polygon': 'polygon',
      'tether-solana': 'solana',

    };
    return mapping[currencyId] || 'erc20';
  };

  // Effects
  useEffect(() => {
    initializePaymentSession();

    return () => {
      websocketClient.disconnect();
      // Stop all blockchain monitoring on unmount
      blockchainMonitorFixed.stopMonitoring();
      enhancedBlockchainMonitor.stopAllMonitoring();
    };
  }, [initializePaymentSession]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Periodic check as fallback
    const checkInterval = setInterval(checkSessionStatus, 30000);
    return () => clearInterval(checkInterval);
  }, [checkSessionStatus]);

  // Start real blockchain monitoring after session creation
  useEffect(() => {
    if (currentSession && backendConnected) {
      console.log('🚀 STARTING ENHANCED BLOCKCHAIN MONITORING for selected network...');
      console.log('🎯 Network details:', {
        currencyId: paymentAddress.currency.id,
        currencyNetwork: paymentAddress.currency.network,
        symbol: paymentAddress.currency.symbol,
        address: paymentAddress.address,
        amount: paymentAddress.amount
      });
      
      startRealBlockchainMonitoring();
      
      // Also start fallback monitoring as backup
      console.log('🔄 Starting fallback monitoring as backup...');
      startFallbackMonitoring();
    }
  }, [currentSession, backendConnected, startRealBlockchainMonitoring, startFallbackMonitoring]);

  // Monitor confirmations for detected transaction
  useEffect(() => {
    if (!currentTransaction || currentTransaction.status === 'confirmed') return;
    
    console.log('🔄 Запуск мониторинга подтверждений...');
    
    // Проверяем подтверждения каждые 15 секунд
    const confirmationInterval = setInterval(() => {
      monitorTransactionConfirmations();
    }, 15000);
    
    return () => {
      console.log('🛑 Остановка мониторинга подтверждений');
      clearInterval(confirmationInterval);
    };
  }, [currentTransaction, monitorTransactionConfirmations]);

  // Вспомогательные функции
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
      case 'detected':
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
      case 'detected':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">


      {/* Payment Information */}
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
        
        <div className="mt-8 space-y-4">

          
          <div className="text-center">
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
      </div>



      {/* Transaction Status */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Transaction Status</h3>
            <div className="flex items-center space-x-4">

              

            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Last check: {lastChecked.toLocaleTimeString('en-US')}
          </div>
        </div>

        <div className="p-6">
          {currentTransaction ? (
            <div className={`p-6 rounded-xl border-2 ${getStatusBg(currentTransaction.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Transaction Detected</h4>
                {currentTransaction.status === 'confirmed' ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Clock className="h-6 w-6 text-yellow-500" />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600 font-medium">Transaction Hash:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="text-sm bg-white p-2 rounded border font-mono break-all flex-1">
                      {currentTransaction.txHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(currentTransaction.txHash, 'Transaction Hash')}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                      title="Copy hash"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-medium">Confirmations:</span>
                    <div className={`mt-1 ${getStatusColor(currentTransaction.status)} font-semibold`}>
                      {currentTransaction.confirmations} / {currentTransaction.requiredConfirmations}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Status:</span>
                    <div className={`mt-1 font-semibold ${getStatusColor(currentTransaction.status)}`}>
                      {currentTransaction.status === 'confirmed' ? 'Confirmed' : 'Awaiting Confirmations'}
                    </div>
                  </div>
                </div>

                {currentTransaction.status === 'confirmed' && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-semibold">Payment successfully processed!</span>
                    </div>
                    <p className="text-green-600 mt-1">Доступ к сервису будет активирован в течение нескольких секунд.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Waiting for payment</h2>
              <p className="text-xl text-gray-600 mb-8">Monitoring blockchain for incoming funds</p>
              
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4 px-8 py-4 rounded-full bg-blue-50 border border-blue-200">
                  {isChecking ? (
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  ) : (
                    <Clock className="h-8 w-8 text-blue-600" />
                  )}
                  <span className="font-semibold text-lg text-blue-600">Waiting for payment</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-lg text-gray-500">
                  Time elapsed since waiting started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default TransactionMonitorUpdated;
