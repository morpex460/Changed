// Прямая интеграция с блокчейн API для проверки транзакций
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  confirmations: number;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
}

export class BlockchainAPI {
  // Polygon API endpoints
  private polygonApiKey = 'YourPolygonScanAPIKey'; // Нужно получить бесплатный ключ
  
  // Проверка транзакции по хешу (для Polygon USDT)
  async checkTransactionByHash(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      const response = await fetch(
        `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.polygonApiKey}`
      );
      const data = await response.json();
      
      if (data.result) {
        const tx = data.result;
        // Получаем receipt для проверки статуса
        const receiptResponse = await fetch(
          `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.polygonApiKey}`
        );
        const receiptData = await receiptResponse.json();
        
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: parseInt(tx.value, 16).toString(),
          confirmations: tx.blockNumber ? 1 : 0, // Упрощенная логика
          blockNumber: parseInt(tx.blockNumber, 16),
          timestamp: Date.now(),
          status: receiptData.result?.status === '0x1' ? 'success' : 'failed'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка проверки транзакции:', error);
      return null;
    }
  }
  
  // Проверка входящих транзакций на адрес
  async checkIncomingTransactions(address: string, expectedAmount: number): Promise<BlockchainTransaction[]> {
    try {
      const response = await fetch(
        `https://api.polygonscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${this.polygonApiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result
          .filter((tx: any) => tx.to.toLowerCase() === address.toLowerCase())
          .map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toString(),
            confirmations: 1,
            blockNumber: parseInt(tx.blockNumber),
            timestamp: parseInt(tx.timeStamp) * 1000,
            status: 'success' as const
          }));
      }
      
      return [];
    } catch (error) {
      console.error('Ошибка получения транзакций:', error);
      return [];
    }
  }
}

export const blockchainAPI = new BlockchainAPI();
