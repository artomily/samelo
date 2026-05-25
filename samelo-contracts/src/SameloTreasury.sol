// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./interfaces/ITreasury.sol";

/**
 * @title SameloTreasury
 * @notice Central fund manager for the Samelo Watch-to-Earn protocol.
 *         Receives ad revenue in CELO, splits it into reward pool and
 *         protocol reserve, and releases funds to users or the swap contract.
 *
 * @dev    UUPS upgradeable — can be patched without losing state or funds.
 *         Celo Mainnet (Chain ID: 42220)
 *         CELO ERC-20 wrapper: 0x471EcE3750Da237f93B8E339c536989b8978a438
 */
contract SameloTreasury is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuard,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant SWAP_ROLE = keccak256("SWAP_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    IERC20 public celoToken;
    address public oracle;
    address public rewardDistributor;
    address public swapContract;
    uint256 public totalDeposited;
    uint256 public totalPaidOut;
    uint256 public reserveBalance;
    uint256 public rewardPoolBalance;
    uint256 public reserveRatio;
    uint256 public constant MAX_RESERVE_RATIO = 3000;
    mapping(bytes32 => bool) public usedNonces;

    // ─────────────────────────────────────────────────────────────────────────
    // Initializer
    // ─────────────────────────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _celoToken,
        address _oracle,
        address _rewardDistributor,
        uint256 _reserveRatio
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();

        require(_celoToken != address(0), "Treasury: zero celoToken");
        require(_oracle != address(0), "Treasury: zero oracle");
        require(_rewardDistributor != address(0), "Treasury: zero distributor");
        require(_reserveRatio <= MAX_RESERVE_RATIO, "Treasury: ratio too high");

        celoToken = IERC20(_celoToken);
        oracle = _oracle;
        rewardDistributor = _rewardDistributor;
        reserveRatio = _reserveRatio;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, _oracle);
        _grantRole(DISTRIBUTOR_ROLE, _rewardDistributor);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UUPS Upgrade
    // ─────────────────────────────────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event RevenueDeposited(
        address indexed depositor,
        uint256 totalAmount,
        uint256 toPool,
        uint256 toReserve,
        uint256 timestamp
    );

    event RewardActionExecuted(
        address indexed user,
        uint256 amount,
        uint8 actionType,
        bytes32 nonce,
        uint256 timestamp
    );

    event RewardReleased(address indexed user, uint256 amount);
    event SwapFundsReleased(address indexed recipient, uint256 amount);
    event ReserveWithdrawn(address indexed to, uint256 amount);
    event ReserveRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event OracleUpdated(address newOracle);
    event RewardDistributorUpdated(address newDistributor);
    event SwapContractUpdated(address newSwap);

    // ─────────────────────────────────────────────────────────────────────────
    // Revenue Intake
    // ─────────────────────────────────────────────────────────────────────────

    function depositRevenue(uint256 amount)
        external
        onlyRole(ORACLE_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(amount > 0, "Treasury: zero amount");
        celoToken.safeTransferFrom(msg.sender, address(this), amount);
        totalDeposited += amount;
        _splitRevenue(amount);
        uint256 toReserve = (amount * reserveRatio) / 10_000;
        uint256 toPool = amount - toReserve;
        emit RevenueDeposited(msg.sender, amount, toPool, toReserve, block.timestamp);
    }

    function _splitRevenue(uint256 amount) internal {
        uint256 toReserve = (amount * reserveRatio) / 10_000;
        uint256 toPool = amount - toReserve;
        reserveBalance += toReserve;
        rewardPoolBalance += toPool;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fund Release
    // ─────────────────────────────────────────────────────────────────────────

    function releaseReward(address user, uint256 amount)
        external
        onlyRole(DISTRIBUTOR_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(user != address(0), "Treasury: zero user");
        require(amount > 0, "Treasury: zero amount");
        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(user, amount);

        emit RewardReleased(user, amount);
    }

    function releaseForSwap(address recipient, uint256 amount)
        external
        onlyRole(SWAP_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(recipient != address(0), "Treasury: zero recipient");
        require(amount > 0, "Treasury: zero amount");
        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(recipient, amount);

        emit SwapFundsReleased(recipient, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Silent Background TX
    // ─────────────────────────────────────────────────────────────────────────

    function executeRewardAction(
        address user,
        uint256 amount,
        uint8 actionType,
        bytes32 nonce,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        require(user != address(0), "Treasury: zero user");
        require(amount > 0, "Treasury: zero amount");

        require(!usedNonces[nonce], "Treasury: nonce already used");
        _verifyOracleSignature(user, amount, actionType, nonce, signature);
        usedNonces[nonce] = true;

        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(user, amount);

        emit RewardActionExecuted(user, amount, actionType, nonce, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _verifyOracleSignature(
        address user,
        uint256 amount,
        uint8 actionType,
        bytes32 nonce,
        bytes calldata signature
    ) internal view {
        bytes32 hash = keccak256(
            abi.encodePacked(user, amount, actionType, nonce, address(this))
        );
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(ethHash, signature);
        require(signer == oracle, "Treasury: invalid oracle signature");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin Controls
    // ─────────────────────────────────────────────────────────────────────────

    function setReserveRatio(uint256 bps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(bps <= MAX_RESERVE_RATIO, "Treasury: ratio too high");
        uint256 old = reserveRatio;
        reserveRatio = bps;
        emit ReserveRatioUpdated(old, bps);
    }

    function setOracle(address newOracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOracle != address(0), "Treasury: zero address");
        _revokeRole(ORACLE_ROLE, oracle);
        oracle = newOracle;
        _grantRole(ORACLE_ROLE, newOracle);
        emit OracleUpdated(newOracle);
    }

    function setRewardDistributor(address dist) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(dist != address(0), "Treasury: zero address");
        _revokeRole(DISTRIBUTOR_ROLE, rewardDistributor);
        rewardDistributor = dist;
        _grantRole(DISTRIBUTOR_ROLE, dist);
        emit RewardDistributorUpdated(dist);
    }

    function setSwapContract(address swap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(swap != address(0), "Treasury: zero address");
        if (swapContract != address(0)) {
            _revokeRole(SWAP_ROLE, swapContract);
        }
        swapContract = swap;
        _grantRole(SWAP_ROLE, swap);
        emit SwapContractUpdated(swap);
    }

    function withdrawReserve(address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonReentrant
    {
        require(to != address(0), "Treasury: zero address");
        require(amount > 0, "Treasury: zero amount");
        require(reserveBalance >= amount, "Treasury: reserve insufficient");

        reserveBalance -= amount;
        celoToken.safeTransfer(to, amount);

        emit ReserveWithdrawn(to, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View Functions
    // ─────────────────────────────────────────────────────────────────────────

    function getRewardPoolBalance() external view returns (uint256) {
        return rewardPoolBalance;
    }

    function getReserveBalance() external view returns (uint256) {
        return reserveBalance;
    }

    function getTotalStats()
        external
        view
        returns (
            uint256 deposited,
            uint256 paidOut,
            uint256 reserve,
            uint256 pool
        )
    {
        return (totalDeposited, totalPaidOut, reserveBalance, rewardPoolBalance);
    }

    function isNonceUsed(bytes32 nonce) external view returns (bool) {
        return usedNonces[nonce];
    }
}
