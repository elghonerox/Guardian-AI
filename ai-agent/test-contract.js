// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY GENERATOR - FINAL VERSION WITH REAL ABI
// ═══════════════════════════════════════════════════════════════════════════

import { Web3 } from 'web3';

const CONFIG = {
    RPC_URL: 'https://dream-rpc.somnia.network/',
    CONTRACT_ADDRESS: '0xEb2453B9B1F9cf172e03623E7230f42fB261D06C',
    PRIVATE_KEY: '0xa9b318ab034ed914b9d80fc8b44330177d643bbdbfa7f6ad77f053183ede9273',
};

// REAL ABI FROM SOMNIA EXPLORER
const VAULT_ABI = [{"inputs":[{"internalType":"uint256","name":"_withdrawalLimit","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FailedCall","type":"error"},{"inputs":[{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"InvalidAmount","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[],"name":"Unauthorized","type":"error"},{"inputs":[],"name":"WithdrawalLimitExceeded","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardian","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"EmergencyPause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"action","type":"string"},{"indexed":false,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GuardianAction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"SuspiciousActivity","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"acceptGuardianRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"emergencyPause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guardianAgent","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastWithdrawalTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingGuardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newGuardian","type":"address"}],"name":"setGuardianAgent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"suspiciousActivityCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"updateWithdrawalLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawalLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];

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
        console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.cyan}║         🎬 GUARDIAN AI - ACTIVITY GENERATOR          ║${colors.reset}`);
        console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
        
        console.log(`${colors.yellow}📍 Contract: ${CONFIG.CONTRACT_ADDRESS}${colors.reset}`);
        console.log(`${colors.yellow}👤 Wallet: ${this.account.address.substring(0, 12)}...${colors.reset}\n`);

        console.log(`${colors.green}🎯 Creating SUSPICIOUS ACTIVITY scenario...${colors.reset}\n`);

        try {
            // Method 1: Try deposit() function
            console.log(`${colors.cyan}📥 Step 1: Depositing 0.15 STT...${colors.reset}`);
            
            let depositSuccess = false;
            try {
                const depositTx = await this.contract.methods.deposit().send({
                    from: this.account.address,
                    value: this.web3.utils.toWei('0.15', 'ether'),
                    gas: 200000
                });
                console.log(`${colors.green}✅ Deposit successful via deposit() function!${colors.reset}`);
                console.log(`   TX: ${depositTx.transactionHash.substring(0, 20)}...${colors.reset}\n`);
                depositSuccess = true;
            } catch (e) {
                console.log(`${colors.yellow}⚠️  deposit() failed, trying direct transfer...${colors.reset}`);
                
                // Method 2: Direct transfer (receive function)
                const directTx = await this.web3.eth.sendTransaction({
                    from: this.account.address,
                    to: CONFIG.CONTRACT_ADDRESS,
                    value: this.web3.utils.toWei('0.15', 'ether'),
                    gas: 100000
                });
                console.log(`${colors.green}✅ Deposit successful via direct transfer!${colors.reset}`);
                console.log(`   TX: ${directTx.transactionHash.substring(0, 20)}...${colors.reset}\n`);
                depositSuccess = true;
            }

            if (!depositSuccess) {
                throw new Error('Both deposit methods failed');
            }

            await this.sleep(3000);

            // Step 2: Rapid withdrawals
            console.log(`${colors.yellow}⚠️  Step 2: Creating suspicious pattern...${colors.reset}`);
            console.log(`${colors.yellow}   Making 3 rapid withdrawals (< 10 seconds apart)${colors.reset}\n`);

            for (let i = 1; i <= 3; i++) {
                console.log(`${colors.cyan}   Withdrawal ${i}/3 (0.02 STT)...${colors.reset}`);
                const tx = await this.contract.methods.withdraw(
                    this.web3.utils.toWei('0.02', 'ether')
                ).send({
                    from: this.account.address,
                    gas: 300000
                });
                console.log(`${colors.green}   ✅ TX: ${tx.transactionHash.substring(0, 20)}...${colors.reset}`);
                
                if (i < 3) await this.sleep(3000);
            }

            console.log(`\n${colors.red}${colors.bright}🚨 SUSPICIOUS ACTIVITY CREATED!${colors.reset}`);
            console.log(`${colors.yellow}   Contract detected rapid withdrawals${colors.reset}\n`);
            
            // Check final state
            const balance = await this.contract.methods.getContractBalance().call();
            const suspiciousCount = await this.contract.methods.suspiciousActivityCount().call();
            
            console.log(`${colors.cyan}📊 Final State:${colors.reset}`);
            console.log(`   Balance: ${this.web3.utils.fromWei(balance, 'ether')} STT`);
            console.log(`   Suspicious Count: ${suspiciousCount}\n`);

            console.log(`${colors.green}${colors.bright}✅ SCENARIO COMPLETE!${colors.reset}`);
            console.log(`${colors.cyan}🎬 Now run: ${colors.bright}npm run demo${colors.reset}`);
            console.log(`${colors.cyan}   AI will detect suspicious activity count: ${suspiciousCount}${colors.reset}\n`);

        } catch (error) {
            console.log(`${colors.red}❌ Failed: ${error.message}${colors.reset}\n`);
            console.log(`${colors.yellow}💡 Try running your agent anyway - it may still work!${colors.reset}\n`);
        }
    }
}

const generator = new ActivityGenerator();
generator.run();