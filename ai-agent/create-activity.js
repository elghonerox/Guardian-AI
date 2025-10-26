// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY GENERATOR - CONFIRMED WORKING WITH DIRECT TRANSFER
// ═══════════════════════════════════════════════════════════════════════════

import { Web3 } from 'web3';

const CONFIG = {
    RPC_URL: 'https://dream-rpc.somnia.network/',
    CONTRACT_ADDRESS: '0xEb2453B9B1F9cf172e03623E7230f42fB261D06C',
    PRIVATE_KEY: '0xa9b318ab034ed914b9d80fc8b44330177d643bbdbfa7f6ad77f053183ede9273',
};

const VAULT_ABI = [
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"suspiciousActivityCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

class ActivityGenerator {
    constructor() {
        this.web3 = new Web3(CONFIG.RPC_URL);
        this.account = this.web3.eth.accounts.privateKeyToAccount(CONFIG.PRIVATE_KEY);
        this.web3.eth.accounts.wallet.add(this.account);
        this.contract = new this.web3.eth.Contract(VAULT_ABI, CONFIG.CONTRACT_ADDRESS);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run() {
        console.log(`\n${colors.cyan}${colors.bright}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.cyan}${colors.bright}║         🎬 GUARDIAN AI - ACTIVITY GENERATOR          ║${colors.reset}`);
        console.log(`${colors.cyan}${colors.bright}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
        
        console.log(`${colors.yellow}📍 Contract: ${CONFIG.CONTRACT_ADDRESS}${colors.reset}`);
        console.log(`${colors.yellow}👤 Wallet: ${this.account.address.substring(0, 12)}...${colors.reset}\n`);

        console.log(`${colors.green}${colors.bright}🎯 Creating SUSPICIOUS ACTIVITY Scenario${colors.reset}\n`);

        try {
            // Step 1: Deposit via direct transfer (WORKING METHOD)
            console.log(`${colors.cyan}📥 Step 1: Depositing 0.15 STT (via direct transfer)...${colors.reset}`);
            
            const gasEstimate = await this.web3.eth.estimateGas({
                from: this.account.address,
                to: CONFIG.CONTRACT_ADDRESS,
                value: this.web3.utils.toWei('0.15', 'ether')
            });
            
            const depositTx = await this.web3.eth.sendTransaction({
                from: this.account.address,
                to: CONFIG.CONTRACT_ADDRESS,
                value: this.web3.utils.toWei('0.15', 'ether'),
                gas: Number(gasEstimate) + 50000
            });
            
            console.log(`${colors.green}${colors.bright}✅ Deposit successful!${colors.reset}`);
            console.log(`${colors.green}   TX: ${depositTx.transactionHash}${colors.reset}`);
            console.log(`${colors.cyan}   🔗 View: https://shannon-explorer.somnia.network/tx/${depositTx.transactionHash}${colors.reset}\n`);

            await this.sleep(3000);

            // Step 2: Rapid withdrawals (triggers suspicious activity)
            console.log(`${colors.yellow}${colors.bright}⚠️  Step 2: Creating suspicious withdrawal pattern...${colors.reset}`);
            console.log(`${colors.yellow}   Making 3 rapid withdrawals (< 10 seconds apart)${colors.reset}\n`);

            for (let i = 1; i <= 3; i++) {
                console.log(`${colors.cyan}   💸 Withdrawal ${i}/3 (0.02 STT)...${colors.reset}`);
                
                const tx = await this.contract.methods.withdraw(
                    this.web3.utils.toWei('0.02', 'ether')
                ).send({
                    from: this.account.address,
                    gas: 300000
                });
                
                console.log(`${colors.green}   ✅ Success! TX: ${tx.transactionHash.substring(0, 20)}...${colors.reset}`);
                
                // 3 second delay (< 10 seconds triggers suspicious activity)
                if (i < 3) {
                    await this.sleep(3000);
                }
            }

            console.log(`\n${colors.red}${colors.bright}🚨 SUSPICIOUS ACTIVITY CREATED!${colors.reset}`);
            console.log(`${colors.yellow}   Contract has detected rapid withdrawals${colors.reset}`);
            console.log(`${colors.yellow}   Suspicious activity counter increased${colors.reset}\n`);

            // Step 3: Check final state
            console.log(`${colors.cyan}📊 Checking final contract state...${colors.reset}\n`);
            
            const balance = await this.contract.methods.getContractBalance().call();
            const suspiciousCount = await this.contract.methods.suspiciousActivityCount().call();
            
            const balanceEth = this.web3.utils.fromWei(balance, 'ether');
            
            console.log(`${colors.bright}Final State:${colors.reset}`);
            console.log(`${colors.green}   💰 Contract Balance: ${balanceEth} STT${colors.reset}`);
            console.log(`${colors.red}   🚨 Suspicious Count: ${suspiciousCount}${colors.reset}`);
            console.log(`${colors.yellow}   📊 Threshold: 2 (AI will pause at ≥2)${colors.reset}\n`);

            console.log(`${colors.green}${colors.bright}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
            console.log(`${colors.green}${colors.bright}║              ✅ SCENARIO COMPLETE!                       ║${colors.reset}`);
            console.log(`${colors.green}${colors.bright}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
            
            console.log(`${colors.cyan}${colors.bright}🎬 NEXT STEP: Run the AI Agent${colors.reset}`);
            console.log(`${colors.cyan}   Command: ${colors.bright}npm run demo${colors.reset}`);
            console.log(`${colors.cyan}   Expected: AI will detect suspicious count of ${suspiciousCount}${colors.reset}`);
            
            if (Number(suspiciousCount) >= 2) {
                console.log(`${colors.red}   ${colors.bright}→ AI WILL EXECUTE EMERGENCY PAUSE!${colors.reset}`);
            } else {
                console.log(`${colors.yellow}   → AI will flag as suspicious activity${colors.reset}`);
            }
            
            console.log(`\n${colors.green}🎉 Perfect demo scenario ready!${colors.reset}\n`);

        } catch (error) {
            console.log(`\n${colors.red}${colors.bright}❌ FAILED: ${error.message}${colors.reset}\n`);
            console.log(`${colors.yellow}Debug info:${colors.reset}`);
            console.log(`   Error: ${error.message}`);
            if (error.receipt) {
                console.log(`   TX Hash: ${error.receipt.transactionHash}`);
            }
            console.log(`\n${colors.yellow}💡 Try running the AI agent anyway - it may still demonstrate monitoring!${colors.reset}\n`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

const generator = new ActivityGenerator();
generator.run().catch(error => {
    console.error(`\n${colors.red}Fatal error: ${error.message}${colors.reset}\n`);
    process.exit(1);
});