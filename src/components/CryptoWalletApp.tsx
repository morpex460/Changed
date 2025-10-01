import React, { useState, useReducer, useEffect } from 'react';
import { ArrowLeft, Shield, Zap, Clock, ArrowDown } from 'lucide-react';
import { CryptoCurrency, WalletState, PaymentStep, BaseCurrency, Network } from '../types/wallet';
import { BASE_CURRENCIES, NETWORKS, getAvailableNetworks, createFullCurrency, createPaymentAddress, calculateCryptoAmount, getSubscriptionPrice } from '../utils/crypto';
import NavigationHeader from './NavigationHeader';
import PaymentMethodSelector from './PaymentMethodSelector';
import NetworkSelector from './NetworkSelector';
import PaymentForm from './PaymentForm';
import TransactionMonitor from './TransactionMonitorUpdated';
import SuccessPage from './SuccessPage';
import Contactw from './Contactw';

// Ключ для localStorage
const WALLET_STATE_KEY = 'yyps_wallet_state';

// Функция для сохранения состояния в localStorage
const saveStateToStorage = (state: WalletState) => {
  try {
    // Сохраняем состояние для 3-го шага (Send Payment) и 5-го шага (Success Page)
    if (state.currentStep === 3 || state.currentStep === 5) {
      const stateToSave = {
        currentStep: state.currentStep,
        selectedBaseCurrency: state.selectedBaseCurrency,
        selectedNetwork: state.selectedNetwork,
        selectedCurrency: state.selectedCurrency,
        paymentAddress: state.paymentAddress,
        transaction: state.transaction,
        timestamp: Date.now()
      };
      localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(stateToSave));
      console.log('💾 Состояние сохранено в localStorage (шаг ' + state.currentStep + '):', stateToSave);
    }
  } catch (error) {
    console.error('Ошибка сохранения состояния:', error);
  }
};

// Функция для загрузки состояния из localStorage
const loadStateFromStorage = (): Partial<WalletState> | null => {
  try {
    const savedState = localStorage.getItem(WALLET_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Проверяем, что состояние не старше 24 часов
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (parsedState.timestamp && (Date.now() - parsedState.timestamp) < twentyFourHours) {
        console.log('📂 Состояние загружено из localStorage:', parsedState);
        return parsedState;
      } else {
        // Удаляем устаревшее состояние
        localStorage.removeItem(WALLET_STATE_KEY);
        console.log('🗑️ Устаревшее состояние удалено');
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки состояния:', error);
  }
  return null;
};

// Функция для очистки сохраненного состояния
const clearStoredState = () => {
  try {
    localStorage.removeItem(WALLET_STATE_KEY);
    console.log('🗑️ Сохраненное состояние очищено');
  } catch (error) {
    console.error('Ошибка очистки состояния:', error);
  }
};

// Wallet state
const getInitialState = (): WalletState => {
  const savedState = loadStateFromStorage();
  if (savedState && (savedState.currentStep === 3 || savedState.currentStep === 5)) {
    console.log('🔄 Восстановление состояния для шага', savedState.currentStep);
    return {
      currentStep: savedState.currentStep || 1,
      selectedBaseCurrency: savedState.selectedBaseCurrency || null,
      selectedNetwork: savedState.selectedNetwork || null,
      selectedCurrency: savedState.selectedCurrency || null,
      paymentAddress: savedState.paymentAddress || null,
      transaction: savedState.transaction || null,
      isLoading: false,
      error: null,
      showAdditionalCurrencies: false,
      preventAutoGeneration: false,
    };
  }
  
  return {
    currentStep: 1,
    selectedBaseCurrency: null,
    selectedNetwork: null,
    selectedCurrency: null,
    paymentAddress: null,
    transaction: null,
    isLoading: false,
    error: null,
    showAdditionalCurrencies: false,
    preventAutoGeneration: false,
  };
};

// Reducer for state management
const walletReducer = (state: WalletState, action: any): WalletState => {
  switch (action.type) {
    case 'SELECT_BASE_CURRENCY':
      return {
        ...state,
        selectedBaseCurrency: action.payload,
        currentStep: 2,
        error: null,
      };
    case 'SELECT_NETWORK':
      const fullCurrency = createFullCurrency(state.selectedBaseCurrency!, action.payload);
      return {
        ...state,
        selectedNetwork: action.payload,
        selectedCurrency: fullCurrency,
        currentStep: 3, // Сразу переходим к мониторингу транзакций
        error: null,
      };
    case 'SET_PAYMENT_ADDRESS':
      const paymentState = {
        ...state,
        paymentAddress: action.payload,
        currentStep: 3,
      };
      // Сохраняем состояние при переходе на Send Payment шаг
      saveStateToStorage(paymentState);
      return paymentState;
    case 'SET_TRANSACTION':
      return {
        ...state,
        transaction: action.payload,
        currentStep: 4,
      };
    case 'SET_SUCCESS':
      const successState = {
        ...state,
        currentStep: 5,
      };
      // Сохраняем состояние при переходе на Success Page
      saveStateToStorage(successState);
      return successState;
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'TOGGLE_ADDITIONAL_CURRENCIES':
      return {
        ...state,
        showAdditionalCurrencies: !state.showAdditionalCurrencies,
      };
    case 'RESET':
      // Очищаем сохраненное состояние при сбросе
      clearStoredState();
      return getInitialState();
    case 'CLEAR_PREVENT_AUTO_GENERATION':
      return {
        ...state,
        preventAutoGeneration: false,
      };
    case 'GO_BACK':
      console.log('=== GO_BACK РЕДЬЮСЕР ВЫЗВАН ===');
      console.log('Текущий шаг:', state.currentStep);
      
      if (state.currentStep <= 1) {
        console.log('Уже на первом шаге, возврат отменен');
        return state;
      }
      
      let newStep = state.currentStep - 1;
      let newState = { ...state, currentStep: newStep, error: null };
      
      // Reset data when going back from network selection (step 2 -> 1)
      if (state.currentStep === 2) {
        console.log('Возврат с шага 2 -> 1: сброс валюты и сети');
        newState.selectedBaseCurrency = null;
        newState.selectedNetwork = null;
        newState.selectedCurrency = null;
      }
      
      // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: полный сброс при возврате с мониторинга транзакций (step 3 -> 2)
      if (state.currentStep === 3) {
        console.log('=== ВОЗВРАТ С ШАГА 3 -> 2 ===');
        console.log('КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: полный сброс состояния для предотвращения проблем с переключением сетей');
        
        // Полный сброс состояния - это предотвращает "прилипание" старых значений сети
        newState.paymentAddress = null;
        newState.transaction = null;
        newState.selectedNetwork = null;   // НОВОЕ: сбрасываем выбранную сеть
        newState.selectedCurrency = null;  // НОВОЕ: сбрасываем валюту, заставляя пользователя выбрать заново
        
        // Флаг для предотвращения автоматической генерации адреса
        newState.preventAutoGeneration = true;
        
        console.log('🔄 Состояние полностью сброшено - пользователь должен выбрать сеть заново');
      }
      
      // Reset transaction when going back from confirmation (step 4 -> 3)
      if (state.currentStep === 4) {
        console.log('Возврат с шага 4 -> 3: сброс транзакции');
        newState.transaction = null;
      }
      
      console.log('Результат GO_BACK, новый шаг:', newState.currentStep);
      console.log('Новое состояние:', newState);
      return newState;
    default:
      return state;
  }
};

// Payment process steps
const paymentSteps: PaymentStep[] = [
  {
    id: 1,
    title: 'Choose Currency',
    description: 'Select USDT',
    completed: false,
    current: true,
  },
  {
    id: 2,
    title: 'Select Network',
    description: 'Choose blockchain network',
    completed: false,
    current: false,
  },
  {
    id: 3,
    title: 'Send Payment',
    description: 'Transfer funds to address',
    completed: false,
    current: false,
  },
  {
    id: 4,
    title: 'Confirmation',
    description: 'Waiting for confirmation',
    completed: false,
    current: false,
  },
  {
    id: 5,
    title: 'Access Granted',
    description: 'Discord access activated',
    completed: false,
    current: false,
  },
];

const CryptoWalletApp: React.FC = () => {
  const [state, dispatch] = useReducer(walletReducer, getInitialState());

  // Эффект для инициализации состояния при загрузке
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState && (savedState.currentStep === 3 || savedState.currentStep === 5)) {
      console.log('🔄 Восстановление состояния для шага ' + savedState.currentStep + ' после перезагрузки');
      // Состояние уже восстановлено в getInitialState, просто логируем
    }
  }, []);

  // Эффект для сохранения состояния при изменениях
  useEffect(() => {
    if (state.currentStep === 3 || state.currentStep === 5) {
      saveStateToStorage(state);
    }
  }, [state]);

  const handleBaseCurrencySelect = (baseCurrency: BaseCurrency) => {
    dispatch({ type: 'SELECT_BASE_CURRENCY', payload: baseCurrency });
    // Scroll to main content area to show network selection
    setTimeout(() => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNetworkSelect = async (network: Network) => {
    console.log('🔄 ПЕРЕКЛЮЧЕНИЕ СЕТИ - начало');
    console.log('Выбранная сеть:', network);
    console.log('Базовая валюта:', state.selectedBaseCurrency);
    
    dispatch({ type: 'SELECT_NETWORK', payload: network });
    
    // Автоматически генерируем адрес для платежа
    const fullCurrency = createFullCurrency(state.selectedBaseCurrency!, network);
    console.log('🪙 Создана полная валюта:', fullCurrency);
    console.log('📊 Currency ID:', fullCurrency.id);
    console.log('🌐 Сеть в объекте:', fullCurrency.network);
    
    const usdAmount = getSubscriptionPrice();
    const amount = calculateCryptoAmount(usdAmount, fullCurrency);
    
    try {
      const paymentAddress = await createPaymentAddress(fullCurrency, amount);
      dispatch({ type: 'SET_PAYMENT_ADDRESS', payload: paymentAddress });
    } catch (error) {
      console.error('Ошибка генерации адреса:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Payment address generation error' });
    }
    
    // Scroll to top of page
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handlePaymentAddressGenerated = (paymentAddress: any) => {
    dispatch({ type: 'SET_PAYMENT_ADDRESS', payload: paymentAddress });
  };

  const handleTransactionDetected = (transaction: any) => {
    dispatch({ type: 'SET_TRANSACTION', payload: transaction });
  };

  const handlePaymentSuccess = () => {
    dispatch({ type: 'SET_SUCCESS' });
  };

  const handleGoBack = () => {
    console.log('=== КНОПКА НАЗАД НАЖАТА ===');
    console.log('Текущий шаг:', state.currentStep);
    console.log('Текущее состояние:', state);
    
    if (state.currentStep <= 1) {
      console.log('Уже на первом шаге, возврат невозможен');
      return;
    }
    
    // Добавляем предупреждение для третьего шага
    if (state.currentStep === 3) {
      console.log('Возврат с третьего шага (Send Payment)');
      console.log('Сбрасываем paymentAddress и transaction');
    }
    
    dispatch({ type: 'GO_BACK' });
    console.log('Действие GO_BACK отправлено');
  };

  const handleReset = () => {
    // Очищаем сохраненное состояние и сбрасываем к началу
    clearStoredState();
    dispatch({ type: 'RESET' });
  };

  const handleClearPreventAutoGeneration = () => {
    console.log('Очистка флага preventAutoGeneration');
    dispatch({ type: 'CLEAR_PREVENT_AUTO_GENERATION' });
  };

  // DEBUG ONLY - для тестирования быстрого перехода к финальному экрану
  const jumpToFinalStep = () => {
    // Создаем полные моковые данные
    const mockBaseCurrency = BASE_CURRENCIES[0]; // USDT
    const mockNetwork = NETWORKS[2]; // TRC-20
    const mockFullCurrency = createFullCurrency(mockBaseCurrency, mockNetwork);
    
    const mockPaymentAddress = {
      address: 'TQn9Y2khEsLMWD7oRzs8B9GC6ZxK2Qm4yE',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      currency: mockFullCurrency,
      amount: 50.00,
      usdAmount: 50.00
    };
    
    const mockTransaction = {
      id: 'mock-tx-123',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      currency: mockFullCurrency,
      amount: 50.00,
      usdAmount: 50.00,
      status: 'confirmed' as const,
      timestamp: new Date(),
      confirmations: 12,
      requiredConfirmations: 10
    };
    
    // Устанавливаем все данные в правильном порядке
    dispatch({ type: 'SELECT_BASE_CURRENCY', payload: mockBaseCurrency });
    setTimeout(() => {
      dispatch({ type: 'SELECT_NETWORK', payload: mockNetwork });
      setTimeout(() => {
        dispatch({ type: 'SET_PAYMENT_ADDRESS', payload: mockPaymentAddress });
        setTimeout(() => {
          dispatch({ type: 'SET_TRANSACTION', payload: mockTransaction });
          setTimeout(() => {
            dispatch({ type: 'SET_SUCCESS' });
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  };

  const currentStepData = paymentSteps.find(step => step.id === state.currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Top Navigation */}
      <NavigationHeader />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {state.currentStep > 1 && state.currentStep < 5 && (
                <button
                  onClick={handleGoBack}
                  className="relative z-50 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-gray-300 shadow-sm"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                  title="Back to previous step"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-normal py-1">
                  Crypto Payment
                </h1>
                <p className="text-sm text-gray-600 mt-2">Fast & secure subscription payment</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-700">Instant</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-full">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-700">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Progress */}
          <div className="hidden md:flex items-center justify-between">
            {paymentSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 shadow-lg ${
                      step.id < state.currentStep
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white transform scale-105'
                        : step.id === state.currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white ring-4 ring-purple-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {step.id < state.currentStep ? '✓' : step.id}
                  </div>
                  <div className="ml-4">
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      step.id <= state.currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-32">{step.description}</div>
                  </div>
                </div>
                {index < paymentSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-6 transition-all duration-500 rounded-full ${
                    step.id < state.currentStep 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Mobile Progress - Compact view */}
          <div className="md:hidden">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {paymentSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 shadow-md ${
                      step.id < state.currentStep
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : step.id === state.currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white ring-2 ring-purple-200'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id < state.currentStep ? '✓' : step.id}
                  </div>
                  {index < paymentSteps.length - 1 && (
                    <div className={`w-3 h-0.5 transition-all duration-500 rounded-full ${
                      step.id < state.currentStep 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Current step info for mobile */}
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">
                {paymentSteps.find(step => step.id === state.currentStep)?.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {paymentSteps.find(step => step.id === state.currentStep)?.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          {state.currentStep === 1 && (
            <PaymentMethodSelector
              baseCurrencies={BASE_CURRENCIES}
              onBaseCurrencySelect={handleBaseCurrencySelect}
              isLoading={state.isLoading}
            />
          )}

          {state.currentStep === 2 && state.selectedBaseCurrency && (
            <NetworkSelector
              baseCurrency={state.selectedBaseCurrency}
              networks={getAvailableNetworks(state.selectedBaseCurrency.symbol)}
              onNetworkSelect={handleNetworkSelect}
              isLoading={state.isLoading}
            />
          )}

          {state.currentStep === 3 && state.paymentAddress && (
            <TransactionMonitor
              paymentAddress={state.paymentAddress}
              onTransactionDetected={handleTransactionDetected}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {state.currentStep === 4 && state.transaction && (
            <TransactionMonitor
              paymentAddress={state.paymentAddress!}
              transaction={state.transaction}
              onTransactionDetected={handleTransactionDetected}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {state.currentStep === 5 && (
            <SuccessPage
              transaction={state.transaction}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <div className="text-red-700 font-medium">
                Error: {state.error}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Contact Section */}
      <Contactw />
      {/* DEBUG ONLY - кнопка для быстрого перехода к финальному экрану */}
      {/* УДАЛИТЬ ЭТОТ БЛОК ПОСЛЕ ТЕСТИРОВАНИЯ */}

    </div>
  );
};

export default CryptoWalletApp;
