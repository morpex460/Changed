// Test script to check the specific transaction mentioned by user
// Transaction: 0x517a258aa1b9f8377e8b7a5bbf8361543adfc4b5feb770291f4b68773227029b
// Expected address: 0x717020d58e62dfd1f18846922a4334a89ca5a360
// Expected amount: $5 USDT
// Network: Polygon

const TEST_TX_HASH = '0x517a258aa1b9f8377e8b7a5bbf8361543adfc4b5feb770291f4b68773227029b';
const EXPECTED_ADDRESS = '0x717020d58e62dfd1f18846922a4334a89ca5a360';
const EXPECTED_AMOUNT = 5;

async function testPolygonTransaction() {
  console.log('🧪 Testing Polygon transaction detection...');
  console.log(`Transaction Hash: ${TEST_TX_HASH}`);
  console.log(`Expected Address: ${EXPECTED_ADDRESS}`);
  console.log(`Expected Amount: ${EXPECTED_AMOUNT} USDT`);
  console.log('');

  try {
    // Test transaction by hash
    const response = await fetch(
      `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${TEST_TX_HASH}`
    );
    
    const data = await response.json();
    console.log('📊 Transaction API Response:', JSON.stringify(data, null, 2));
    
    if (data.result) {
      const tx = data.result;
      console.log('');
      console.log('🔍 Transaction Details:');
      console.log(`- Hash: ${tx.hash}`);
      console.log(`- From: ${tx.from}`);
      console.log(`- To: ${tx.to}`);
      console.log(`- Value: ${tx.value} (${parseInt(tx.value, 16)} wei)`);
      console.log(`- Block Number: ${tx.blockNumber ? parseInt(tx.blockNumber, 16) : 'Pending'}`);
      
      // Get transaction receipt
      const receiptResponse = await fetch(
        `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${TEST_TX_HASH}`
      );
      
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
        
        // Check if this is a USDT transaction by looking at logs
        if (receipt.logs && receipt.logs.length > 0) {
          console.log('');
          console.log('📝 Transaction Logs:');
          receipt.logs.forEach((log, index) => {
            console.log(`Log ${index}:`);
            console.log(`- Address: ${log.address}`);
            console.log(`- Topics: ${log.topics}`);
            console.log(`- Data: ${log.data}`);
          });
        }
      }
      
      // Check if transaction goes to expected address
      const toAddress = tx.to?.toLowerCase();
      const expectedAddr = EXPECTED_ADDRESS.toLowerCase();
      console.log('');
      console.log('🎯 Address Validation:');
      console.log(`- Transaction To: ${toAddress}`);
      console.log(`- Expected Address: ${expectedAddr}`);
      console.log(`- Addresses Match: ${toAddress === expectedAddr ? '✅' : '❌'}`);
      
    } else {
      console.log('❌ Transaction not found or invalid response');
    }
    
  } catch (error) {
    console.error('❌ Error testing transaction:', error);
  }
}

// Test USDT token transfers to the address
async function testUSDTTransfers() {
  console.log('');
  console.log('🪙 Testing USDT token transfers...');
  
  const USDT_CONTRACT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; // USDT on Polygon
  
  try {
    const response = await fetch(
      `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${USDT_CONTRACT}&address=${EXPECTED_ADDRESS}&startblock=0&endblock=99999999&sort=desc`
    );
    
    const data = await response.json();
    console.log('💰 USDT Transfers Response:', JSON.stringify(data, null, 2));
    
    if (data.status === '1' && data.result) {
      console.log('');
      console.log(`📈 Found ${data.result.length} USDT transactions`);
      
      // Look for transactions around $5
      const recentTransactions = data.result.slice(0, 10); // Last 10 transactions
      recentTransactions.forEach((tx, index) => {
        const amount = parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
        console.log(`Transaction ${index + 1}:`);
        console.log(`- Hash: ${tx.hash}`);
        console.log(`- From: ${tx.from}`);
        console.log(`- To: ${tx.to}`);
        console.log(`- Amount: ${amount} USDT`);
        console.log(`- Block: ${tx.blockNumber}`);
        console.log(`- Time: ${new Date(parseInt(tx.timeStamp) * 1000).toISOString()}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing USDT transfers:', error);
  }
}

// Run tests
testPolygonTransaction().then(() => {
  return testUSDTTransfers();
});
