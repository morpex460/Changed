// Alternative test using public RPC endpoints
// This bypasses the API key requirement

const TEST_TX_HASH = '0x517a258aa1b9f8377e8b7a5bbf8361543adfc4b5feb770291f4b68773227029b';
const EXPECTED_ADDRESS_1 = '0x717020d58e62dfd1f18846922a4334a89ca5a360'; // From crypto.ts
const EXPECTED_ADDRESS_2 = '0x742d35Cc6634C0532925a3b8D3de7e5eB84C9C9b'; // From crypto-config.json

// Public Polygon RPC endpoints
const POLYGON_RPC_ENDPOINTS = [
  'https://polygon-rpc.com',
  'https://rpc-mainnet.matic.network',
  'https://rpc.ankr.com/polygon',
  'https://polygon.llamarpc.com'
];

async function testWithRPC(endpoint) {
  console.log(`🔌 Testing with RPC endpoint: ${endpoint}`);
  
  try {
    // Get transaction by hash
    const txResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'eth_getTransactionByHash',
        params: [TEST_TX_HASH],
        id: 1,
        jsonrpc: '2.0'
      })
    });
    
    const txData = await txResponse.json();
    console.log('📊 Transaction Response:', JSON.stringify(txData, null, 2));
    
    if (txData.result) {
      const tx = txData.result;
      console.log('');
      console.log('🔍 Transaction Details:');
      console.log(`- Hash: ${tx.hash}`);
      console.log(`- From: ${tx.from}`);
      console.log(`- To: ${tx.to}`);
      console.log(`- Value: ${tx.value} (${parseInt(tx.value, 16)} wei)`);
      console.log(`- Block Number: ${tx.blockNumber ? parseInt(tx.blockNumber, 16) : 'Pending'}`);
      console.log(`- Gas Used: ${parseInt(tx.gas, 16)}`);
      console.log(`- Gas Price: ${parseInt(tx.gasPrice, 16)}`);
      console.log(`- Nonce: ${parseInt(tx.nonce, 16)}`);
      
      // Get transaction receipt
      const receiptResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'eth_getTransactionReceipt',
          params: [TEST_TX_HASH],
          id: 2,
          jsonrpc: '2.0'
        })
      });
      
      const receiptData = await receiptResponse.json();
      console.log('');
      console.log('📋 Transaction Receipt:', JSON.stringify(receiptData, null, 2));
      
      if (receiptData.result) {
        const receipt = receiptData.result;
        console.log('');
        console.log('✅ Receipt Details:');
        console.log(`- Status: ${receipt.status} (${receipt.status === '0x1' ? 'Success' : 'Failed'})`);
        console.log(`- Gas Used: ${parseInt(receipt.gasUsed, 16)}`);
        console.log(`- Block Number: ${parseInt(receipt.blockNumber, 16)}`);
        console.log(`- Block Hash: ${receipt.blockHash}`);
        
        // Analyze logs for USDT transfer
        if (receipt.logs && receipt.logs.length > 0) {
          console.log('');
          console.log('📝 Transaction Logs Analysis:');
          receipt.logs.forEach((log, index) => {
            console.log(`Log ${index}:`);
            console.log(`- Contract Address: ${log.address}`);
            console.log(`- Topics Count: ${log.topics.length}`);
            if (log.topics.length >= 3) {
              // This might be a Transfer event
              const topic0 = log.topics[0]; // Event signature
              const topic1 = log.topics[1]; // From address (padded)
              const topic2 = log.topics[2]; // To address (padded)
              
              console.log(`- Event Signature: ${topic0}`);
              console.log(`- From (padded): ${topic1}`);
              console.log(`- To (padded): ${topic2}`);
              
              // Extract actual addresses from padded topics
              if (topic1.length === 66) { // 32 bytes + 0x
                const fromAddr = '0x' + topic1.slice(-40);
                console.log(`- From Address: ${fromAddr}`);
              }
              if (topic2.length === 66) { // 32 bytes + 0x
                const toAddr = '0x' + topic2.slice(-40);
                console.log(`- To Address: ${toAddr}`);
                
                // Check if it matches expected addresses
                const toAddrLower = toAddr.toLowerCase();
                const exp1Lower = EXPECTED_ADDRESS_1.toLowerCase();
                const exp2Lower = EXPECTED_ADDRESS_2.toLowerCase();
                
                console.log(`- Matches Expected Addr 1: ${toAddrLower === exp1Lower ? '✅' : '❌'}`);
                console.log(`- Matches Expected Addr 2: ${toAddrLower === exp2Lower ? '✅' : '❌'}`);
              }
            }
            console.log(`- Data: ${log.data}`);
            
            // Try to parse amount from data
            if (log.data && log.data !== '0x') {
              try {
                const amount = parseInt(log.data, 16);
                console.log(`- Amount (raw): ${amount}`);
                console.log(`- Amount (USDT): ${amount / 1000000} USDT`); // USDT has 6 decimals
              } catch (e) {
                console.log(`- Could not parse amount: ${log.data}`);
              }
            }
            console.log('---');
          });
        }
      }
      
      // Address comparison
      console.log('');
      console.log('🎯 Address Validation:');
      console.log(`- Transaction To: ${tx.to}`);
      console.log(`- Expected Address 1 (crypto.ts): ${EXPECTED_ADDRESS_1}`);
      console.log(`- Expected Address 2 (config.json): ${EXPECTED_ADDRESS_2}`);
      console.log(`- Matches Addr 1: ${tx.to?.toLowerCase() === EXPECTED_ADDRESS_1.toLowerCase() ? '✅' : '❌'}`);
      console.log(`- Matches Addr 2: ${tx.to?.toLowerCase() === EXPECTED_ADDRESS_2.toLowerCase() ? '✅' : '❌'}`);
      
      return { success: true, transaction: tx, receipt: receiptData.result };
    } else {
      console.log('❌ Transaction not found');
      return { success: false, error: 'Transaction not found' };
    }
    
  } catch (error) {
    console.error(`❌ Error with ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log('🧪 Testing Polygon transaction with multiple RPC endpoints...');
  console.log(`Transaction Hash: ${TEST_TX_HASH}`);
  console.log(`Expected Address 1: ${EXPECTED_ADDRESS_1}`);
  console.log(`Expected Address 2: ${EXPECTED_ADDRESS_2}`);
  console.log('');
  
  for (const endpoint of POLYGON_RPC_ENDPOINTS) {
    console.log('═'.repeat(80));
    try {
      const result = await testWithRPC(endpoint);
      if (result.success) {
        console.log('✅ Successfully retrieved transaction data!');
        break; // Stop on first success
      }
    } catch (error) {
      console.log(`❌ Failed with ${endpoint}: ${error.message}`);
    }
    console.log('');
  }
}

testAllEndpoints();
