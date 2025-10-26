const GuardianAI = require('./guardian-ai-agent.js');

console.log('🧪 Testing GUARDIAN AI Security System...\n');

// Mock version for testing without real private key
class MockGuardianAI {
    constructor() {
        this.threatsDetected = 0;
        this.isRunning = false;
    }

    async startMock() {
        this.isRunning = true;
        console.log('🤖 MOCK GUARDIAN AI ACTIVATED');
        console.log('📍 Monitoring: 0xEb2453B9B1F9cf172e03623E7230f42fB261D06C');
        console.log('👁️  Simulating 24/7 security monitoring...\n');

        let block = 1000000;
        while (this.isRunning && block < 1000020) {
            console.log(`⏱️  Block ${block} | Balance: 0.5 ETH | Paused: false`);
            
            // Simulate threat detection
            if (block % 3 === 0) {
                console.log('🔍 AI: Scanning for suspicious patterns...');
            }
            
            if (block === 1000005) {
                console.log('🚨 AI DETECTED: Suspicious withdrawal pattern!');
                console.log('🛡️ AI: Analyzing threat level...');
            }
            
            if (block === 1000008) {
                console.log('🔴 EMERGENCY: AI executing contract pause!');
                console.log('✅ Contract secured autonomously');
                this.threatsDetected++;
            }
            
            await this.sleep(2000);
            block++;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        console.log('\n🛑 Mock Guardian AI stopped');
    }

    getStats() {
        return {
            threatsDetected: this.threatsDetected,
            status: 'Demo completed successfully'
        };
    }
}

// Run the mock test
async function runDemo() {
    const mockAI = new MockGuardianAI();
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n📊 Demo Stats:', mockAI.getStats());
        mockAI.stop();
        process.exit(0);
    });

    await mockAI.startMock();
    console.log('\n🎉 DEMO COMPLETED!');
    console.log('📊 Final Stats:', mockAI.getStats());
    console.log('\n🚀 Next: Add your real private key to run live monitoring!');
}

runDemo().catch(console.error);