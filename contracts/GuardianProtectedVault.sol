// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title GuardianProtectedVault
 * @notice Demo vault protected by AI Guardian agent
 * @dev Demonstrates autonomous security with emergency controls
 */
contract GuardianProtectedVault is ReentrancyGuard, Pausable, Ownable {
    using Address for address;

    // State variables (ordered for gas efficiency)
    mapping(address => uint256) public balances;
    address public guardianAgent;
    uint256 public totalDeposits;
    uint256 public withdrawalLimit;
    uint256 public lastWithdrawalTime;
    uint256 public suspiciousActivityCount;
    address public pendingGuardian;

    // Custom errors
    error Unauthorized();
    error InsufficientBalance();
    error WithdrawalLimitExceeded();
    error InvalidAmount();
    error TransferFailed();

    // Events for AI monitoring
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event SuspiciousActivity(address indexed user, string reason, uint256 timestamp);
    event EmergencyPause(address indexed guardian, string reason, uint256 timestamp);
    event GuardianAction(string action, address target, uint256 timestamp);

    constructor(uint256 _withdrawalLimit) Ownable(msg.sender) {
        withdrawalLimit = _withdrawalLimit;
        guardianAgent = msg.sender; // Initial guardian
    }

    modifier onlyGuardian() {
        if (msg.sender != guardianAgent) revert Unauthorized();
        _;
    }

    // Deposit funds (normal user operation)
    function deposit() external payable whenNotPaused nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    // Withdraw funds (monitored by AI)
    function withdraw(uint256 amount) external whenNotPaused nonReentrant {
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        if (amount > withdrawalLimit) revert WithdrawalLimitExceeded();

        // Check for suspicious patterns
        if (block.timestamp - lastWithdrawalTime < 10 seconds) {
            suspiciousActivityCount++;
            emit SuspiciousActivity(msg.sender, "Rapid withdrawals", block.timestamp);
        }

        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        lastWithdrawalTime = block.timestamp;

        // Safe ETH transfer using OpenZeppelin's Address library
        Address.sendValue(payable(msg.sender), amount);

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    // AI Guardian emergency pause
    function emergencyPause(string calldata reason) external onlyGuardian {
        _pause();
        emit EmergencyPause(msg.sender, reason, block.timestamp);
        emit GuardianAction("EMERGENCY_PAUSE", address(0), block.timestamp);
    }

    // AI Guardian unpause after threat cleared
    function unpause() external onlyGuardian {
        _unpause();
        emit GuardianAction("UNPAUSE", address(0), block.timestamp);
    }

    // AI Guardian can adjust withdrawal limits dynamically
    function updateWithdrawalLimit(uint256 newLimit) external onlyGuardian {
        withdrawalLimit = newLimit;
        emit GuardianAction("UPDATE_LIMIT", address(0), block.timestamp);
    }

    // Update guardian address (admin function with 2-step process)
    function setGuardianAgent(address newGuardian) external onlyOwner {
        require(newGuardian != address(0), "Invalid address");
        pendingGuardian = newGuardian;
        emit GuardianAction("PENDING_GUARDIAN", newGuardian, block.timestamp);
    }

    function acceptGuardianRole() external {
        require(msg.sender == pendingGuardian, "Not pending guardian");
        guardianAgent = msg.sender;
        emit GuardianAction("NEW_GUARDIAN", msg.sender, block.timestamp);
    }

    // View functions
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive ETH
    receive() external payable {
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
}