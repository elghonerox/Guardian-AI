import { Web3 } from 'web3';

const web3 = new Web3('https://dream-rpc.somnia.network/');
const CONTRACT_ADDRESS = '0xEb2453B9B1F9cf172e03623E7230f42fB261D06C';
const PRIVATE_KEY = '0xa9b318ab034ed914b9d80fc8b44330177d643bbdbfa7f6ad77f053183ede9273';

const ABI = [{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

async function diagnose() {
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    
    console.log('🔍 Diagnosing deposit issue...\n');
    
    // Try calling deposit() to see revert reason
    try {
        await contract.methods.deposit().call({
            from: account.address,
            value: web3.utils.toWei('0.01', 'ether')
        });
        console.log('✅ Call successful - should work in send()');
    } catch (e) {
        console.log('❌ Call failed:');
        console.log('Error:', e.message);
        console.log('\nRevert reason:', e.innerError?.message || 'Unknown');
    }
    
    // Try direct transfer
    console.log('\n---\nTrying direct ETH transfer...\n');
    try {
        // Just estimate, don't send
        const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: CONTRACT_ADDRESS,
            value: web3.utils.toWei('0.01', 'ether')
        });
        console.log('✅ Direct transfer gas estimate:', gasEstimate);
        console.log('✅ Direct transfer should work!\n');
        
        // Actually send
        console.log('Sending 0.01 STT via direct transfer...');
        const tx = await web3.eth.sendTransaction({
            from: account.address,
            to: CONTRACT_ADDRESS,
            value: web3.utils.toWei('0.01', 'ether'),
            gas: Number(gasEstimate) + 50000
        });
        console.log('✅ SUCCESS! TX:', tx.transactionHash);
        console.log('\n🎉 Use direct transfer method!');
    } catch (e) {
        console.log('❌ Direct transfer failed:', e.message);
    }
}

diagnose();