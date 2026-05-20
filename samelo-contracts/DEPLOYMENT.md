# Samelo Smart Contracts — Deployment Guide

## Overview

**Deployment order:**
1. Deploy `SameloTreasury` (central fund manager)
2. Deploy `SameloSwap` (points-to-CELO swap)
3. Connect `SameloSwap` to `SameloTreasury` (grant `SWAP_ROLE`)
4. Fund `SameloTreasury` with CELO via `depositRevenue()`
5. Verify on Celoscan

---

## Prerequisites

1. **Foundry installed** — `forge --version` should show v0.2.0 or later
2. **Private key** — Deployer wallet with CELO for gas (start small: ~0.5 CELO)
3. **Celoscan API key** (optional, for verification) — [get it here](https://celoscan.io/apis)
4. **Environment variables** — Copy and fill `contracts/.env.example` → `contracts/.env.local`

---

## Step 1: Set Up Environment Variables

```bash
cd /Users/user/Code/samelo/contracts

# Copy template
cp .env.example .env.local

# Edit .env.local with your values:
#   CELO_RPC_URL         - Already set to https://forno.celo.org
#   PRIVATE_KEY          - Your deployer private key (hex, no 0x prefix optional)
#   CELOSCAN_API_KEY     - Get from https://celoscan.io/apis
#   ORACLE_ADDRESS       - Off-chain signer wallet
#   DISTRIBUTOR_ADDRESS  - Reward distributor address (can be same as oracle)
#   RESERVE_RATIO_BPS    - e.g., 1000 (10%)
#   POINTS_TO_CELO_RATE  - e.g., 1e13 (0.00001 CELO per point)
#   MIN_SWAP_POINTS      - e.g., 500
#   MAX_SWAP_POINTS      - e.g., 50000
#   SWAP_COOLDOWN_SECONDS - e.g., 86400 (24 hours)

nano .env.local
```

---

## Step 2: Dry Run (Simulation)

Test the deployment without sending on-chain transactions:

```bash
cd /Users/user/Code/samelo

forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
  --rpc-url https://forno.celo.org \
  -vvv
```

**Expected output:**
- `SameloTreasury` address (starts with 0x)
- `SameloSwap` address (starts with 0x)
- No errors

---

## Step 3: Deploy to Celo Mainnet

### Option A: Simple Deployment (no verification)

```bash
forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
  --rpc-url https://forno.celo.org \
  --broadcast \
  -vvv
```

### Option B: Deploy + Verify on Celoscan

```bash
forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier-url https://api.celoscan.io/api \
  -vvv
```

**This command:**
- Compiles the contract
- Sends the deployment transactions
- Waits for confirmation
- Verifies the source code on Celoscan
- Prints contract addresses

---

## Step 4: Verify Deployment

After the script completes, you'll see:
```
SameloTreasury: 0x...
SameloSwap:     0x...
```

**Check on Celoscan:**
1. Visit `https://celoscan.io/address/0x...SameloTreasury...`
2. Verify the constructor args match your `.env.local` values
3. Repeat for `SameloSwap`

**If verification failed**, manually verify on Celoscan:
- Go to contract page → More → "Code" tab → "Verify & Publish"
- Upload [SameloTreasury.sol](src/SameloTreasury.sol) + [SameloSwap.sol](src/SameloSwap.sol)
- Select Solidity version `0.8.20` and compiler settings matching foundry.toml

---

## Step 5: Fund the Treasury

Before users can earn or swap, the treasury must hold CELO. The backend oracle deposits revenue:

```bash
# Via viem (example)
import { createPublicClient, createWalletClient, http } from 'viem'
import { celo } from 'wagmi/chains'

const TREASURY_ADDRESS = '0x...' // from step 3
const CELO_TOKEN = '0x471EcE3750Da237f93B8E339c536989b8978a438'

const client = createWalletClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
  account: oracleAccount, // Oracle key
})

// 1. Approve CELO transfer
await client.writeContract({
  address: CELO_TOKEN,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [TREASURY_ADDRESS, BigInt(1e20)], // approve large amount
})

// 2. Deposit revenue
await client.writeContract({
  address: TREASURY_ADDRESS,
  abi: SameloTreasuryABI,
  functionName: 'depositRevenue',
  args: [BigInt(1e18)], // 1 CELO
})
```

---

## Step 6: Test the Full Flow

### Test 1: User Earns (executeRewardAction)

```bash
# Backend oracle signs a reward
signature = sign({
  user: "0x...",
  amount: 1e16,      // 0.01 CELO
  actionType: 0,     // watch
  nonce: keccak256("unique-nonce-1"),
  address(treasury)
})

# User submits tx
await publicClient.writeContract({
  address: TREASURY_ADDRESS,
  abi: SameloTreasuryABI,
  functionName: 'executeRewardAction',
  args: [
    "0x...",                    // user
    BigInt(1e16),               // 0.01 CELO
    0,                          // watch action
    "0x...",                    // nonce
    signature
  ]
})
```

### Test 2: User Swaps Points → CELO

```bash
# Backend oracle signs a swap
signature = sign({
  user: "0x...",
  pointAmount: 1000,
  nonce: keccak256("unique-swap-nonce-1"),
  address(swap)    // ⚠️ Bind to SWAP contract, not treasury!
})

# User submits tx
await publicClient.writeContract({
  address: SAMELO_SWAP_ADDRESS,
  abi: SameloSwapABI,
  functionName: 'swapPoints',
  args: [
    BigInt(1000),               // 1000 points
    "0x...",                    // nonce
    signature
  ]
})
# ✓ User receives CELO in their wallet
```

---

## Step 7: Post-Deployment Setup

### Update Frontend Constants

Copy the deployed addresses into your frontend:

**File:** `lib/treasury.abi.ts` (create if missing)
```typescript
export const SAMELO_TREASURY_ADDRESS = '0x...' // from deployment
export const SAMELO_TREASURY_ABI = [
  // Copy from contracts/out/SameloTreasury.sol/SameloTreasury.json → abi field
] as const
```

**File:** `lib/swap.abi.ts` (create if missing)
```typescript
export const SAMELO_SWAP_ADDRESS = '0x...' // from deployment
export const SAMELO_SWAP_ABI = [
  // Copy from contracts/out/SameloSwap.sol/SameloSwap.json → abi field
] as const
```

**File:** `lib/tokens.ts` (existing)
```typescript
export const CELO_TOKEN_ADDRESS = '0x471EcE3750Da237f93B8E339c536989b8978a438'
export const CELO_DECIMALS = 18
```

---

## Troubleshooting

### Error: "Validation failed: Rpc error: invalid sender"
- **Cause:** Private key is invalid or deployer has no funds
- **Fix:** Ensure wallet holds >0.5 CELO on mainnet

### Error: "Compiler run failed"
- **Cause:** Solidity version mismatch
- **Fix:** Verify `solc = "0.8.20"` in `foundry.toml`

### Error: "Nonce already used"
- **Cause:** Re-running dry run contaminated state
- **Fix:** Add `--skip-simulation` flag or use a fresh deployer key

### Verification fails on Celoscan
- **Cause:** Constructor args or compiler settings don't match
- **Fix:** Use the "Verify & Publish" form on Celoscan contract page; upload both .sol files + select identical settings

### `forge build` fails with import errors
- **Cause:** `remappings.txt` or `foundry.toml` misconfigured
- **Fix:** Verify `@openzeppelin/` remapping exists and points to `contracts/lib/openzeppelin-contracts/`

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `forge build` | Compile contracts locally |
| `forge script ... --rpc-url ... -vvv` | Simulate deployment (no on-chain) |
| `forge script ... --rpc-url ... --broadcast` | Deploy to mainnet |
| `forge script ... --broadcast --verify --verifier-url ...` | Deploy + verify |
| `forge test` | Run unit tests (if added) |

---

## Contract Addresses Saved

After successful deployment, save these for reference:
- **SameloTreasury:** `0x...`
- **SameloSwap:** `0x...`
- **Deployer:** `0x...`
- **Oracle:** `0x...`
- **Distributor:** `0x...`

Store in a `.deployment.json` file or documentation for your team.

---

## Next Steps

1. ✅ Deploy contracts
2. ✅ Fund treasury with CELO
3. ⬜ Link frontend to deployed addresses
4. ⬜ Backend oracle: generate signatures for `executeRewardAction` and `swapPoints`
5. ⬜ Launch! 🚀
