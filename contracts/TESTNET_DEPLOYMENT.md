# Testnet Deployment Guide (Celo Alfajores)

## Overview

**Celo Alfajores** is the public testnet for Celo Mainnet.
- **Chain ID:** 44787
- **RPC:** https://alfajores-forno.celo-testnet.org
- **Block Explorer:** https://alfajores.celoscan.io
- **Faucet:** https://faucet.celo.org

**Use this to:**
- Test contracts safely without mainnet costs
- Debug the full flow: deploy → fund → earn → swap
- Verify oracle signature generation
- Test frontend integration

---

## Quick Start (15 minutes)

### 1. Get Testnet CELO

Visit https://faucet.celo.org and enter your wallet address. You'll receive ~1 testnet CELO (enough for everything).

### 2. Create `.env.local` for Testnet

```bash
cd /Users/user/Code/samelo/contracts
cp .env.example .env.local
```

**Edit `.env.local`:**

```env
# Network: Testnet (Alfajores)
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org

# Your private key (get testnet CELO first!)
PRIVATE_KEY=0x...your_testnet_wallet_private_key...

# Celoscan API key (optional for verification)
CELOSCAN_API_KEY=your_celoscan_api_key

# Addresses
ORACLE_ADDRESS=0x...your_signer_wallet...         # Can be same as PRIVATE_KEY
DISTRIBUTOR_ADDRESS=0x...distributor_wallet...   # Can be same as oracle

# Treasury parameters (testnet values)
RESERVE_RATIO_BPS=1000                           # 10%
POINTS_TO_CELO_RATE=1000000000000               # 1e12 (0.000001 CELO/point for easy math)
MIN_SWAP_POINTS=100                              # Lower on testnet
MAX_SWAP_POINTS=10000                            # Lower on testnet
SWAP_COOLDOWN_SECONDS=0                          # No cooldown for fast testing
```

### 3. Dry Run (Simulate)

```bash
cd /Users/user/Code/samelo

forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  -vvv
```

You should see:
```
-----------------------------------------------------------
STEP 1: Deploying SameloTreasury
-----------------------------------------------------------
...
✓ SameloTreasury deployed to: 0x...

-----------------------------------------------------------
STEP 2: Deploying SameloSwap
-----------------------------------------------------------
...
✓ SameloSwap deployed to: 0x...

-----------------------------------------------------------
STEP 3: Registering SameloSwap with Treasury
-----------------------------------------------------------
✓ Treasury granted SWAP_ROLE to SameloSwap

-----------------------------------------------------------
DEPLOYMENT COMPLETE
-----------------------------------------------------------
```

### 4. Deploy to Testnet

```bash
forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast \
  -vvv
```

This will:
- Create 2 transactions (treasury + swap setup)
- Wait for block confirmation
- Print your contract addresses

**Save the addresses:**
```
SameloTreasury: 0x...
SameloSwap:     0x...
```

### 5. Verify on Alfajores Scanner

1. Visit https://alfajores.celoscan.io
2. Paste `SameloTreasury` address
3. Confirm it shows:
   - Constructor args match your `.env.local`
   - Code is present
   - Transactions are visible

---

## Full Testing Flow (30 minutes)

### Step A: Fund the Treasury

The treasury needs CELO for rewards and swaps.

**Option 1: Via Cast (CLI)**

```bash
# Approve CELO transfer
cast send 0x471EcE3750Da237f93B8E339c536989b8978a438 \
  "approve(address,uint256)" \
  0x<YOUR_TREASURY_ADDRESS> \
  100000000000000000000 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key 0x<YOUR_PRIVATE_KEY>

# Deposit 10 CELO into treasury
cast send 0x<YOUR_TREASURY_ADDRESS> \
  "depositRevenue(uint256)" \
  10000000000000000000 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key 0x<YOUR_PRIVATE_KEY>
```

**Option 2: Via Celoscan UI**

1. Go to your treasury address on https://alfajores.celoscan.io
2. Click "Contract" tab → "Write Contract"
3. Connect your wallet
4. Find `depositRevenue` function
5. Enter `10000000000000000000` (10 CELO in wei)
6. Click "Write"

### Step B: Test User Earns (executeRewardAction)

Generate an oracle signature off-chain and call the function:

```bash
# 1. Backend oracle signs a reward payload
# (see Node.js example below)

# 2. User/backend calls the treasury
cast send 0x<YOUR_TREASURY_ADDRESS> \
  "executeRewardAction(address,uint256,uint8,bytes32,bytes)" \
  0x<USER_ADDRESS> \
  1000000000000000 \
  0 \
  0x<NONCE_HASH> \
  0x<SIGNATURE> \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key 0x<YOUR_PRIVATE_KEY>

# Check: user should receive 0.001 CELO to their wallet
```

### Step C: Test Swap Points → CELO

After user has some CELO balance (from earning), they can swap points:

```bash
# 1. Backend oracle signs swap payload (see Node.js example)

# 2. User calls swap
cast send 0x<YOUR_SWAP_ADDRESS> \
  "swapPoints(uint256,bytes32,bytes)" \
  1000 \
  0x<SWAP_NONCE_HASH> \
  0x<SWAP_SIGNATURE> \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key 0x<USER_PRIVATE_KEY>

# Check: user should receive CELO
```

---

## Node.js: Generate Oracle Signatures

Use `ethers.js` or `viem` to generate signatures locally:

### Using ethers.js

```javascript
import { ethers } from 'ethers'

// Treasury signature for executeRewardAction
function signRewardAction(user, amount, actionType, nonce, treasuryAddress) {
  const payload = ethers.solidityPacked(
    ['address', 'uint256', 'uint8', 'bytes32', 'address'],
    [user, amount, actionType, nonce, treasuryAddress]
  )
  const hash = ethers.id(payload)
  const ethHash = ethers.hashMessage(ethers.getBytes(hash))
  
  // Sign with oracle private key
  const wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY)
  const sig = wallet.signingKey.sign(ethHash)
  return ethers.Signature.from(sig).serialized
}

// Swap signature for swapPoints
function signSwapAction(user, pointAmount, nonce, swapAddress) {
  const payload = ethers.solidityPacked(
    ['address', 'uint256', 'bytes32', 'address'],
    [user, pointAmount, nonce, swapAddress]
  )
  const hash = ethers.id(payload)
  const ethHash = ethers.hashMessage(ethers.getBytes(hash))
  
  const wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY)
  const sig = wallet.signingKey.sign(ethHash)
  return ethers.Signature.from(sig).serialized
}

// Example usage
const treasuryAddr = '0x...'
const swapAddr = '0x...'
const user = '0x...'
const nonce = ethers.id('my-unique-nonce-1')

const rewardSig = signRewardAction(
  user,
  ethers.parseEther('0.001'),
  0, // watch action
  nonce,
  treasuryAddr
)
console.log('Reward signature:', rewardSig)

const swapNonce = ethers.id('my-unique-swap-nonce-1')
const swapSig = signSwapAction(user, 1000, swapNonce, swapAddr)
console.log('Swap signature:', swapSig)
```

### Using viem

```typescript
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem'
import { signMessage } from 'viem/accounts'

async function signRewardAction(user, amount, actionType, nonce, treasuryAddress) {
  const payload = encodeAbiParameters(
    parseAbiParameters('address, uint256, uint8, bytes32, address'),
    [user, amount, BigInt(actionType), nonce, treasuryAddress]
  )
  const hash = keccak256(payload)
  
  // Use your oracle wallet
  const signature = await signMessage({ account: oracleAccount, message: { raw: hash } })
  return signature
}
```

---

## Troubleshooting

### Gas Errors
- **Error:** "out of gas" or "insufficient funds"
- **Fix:** Request more testnet CELO from https://faucet.celo.org

### Signature Verification Fails
- **Error:** "Invalid oracle signature"
- **Cause:** Nonce already used, or signature bound to wrong contract address
- **Fix:** Ensure `address(this)` in the payload matches the contract being called (Treasury vs Swap)

### RPC Connection Error
- **Error:** "connect ENOTFOUND alfajores-forno.celo-testnet.org"
- **Fix:** Use the full testnet RPC: `https://alfajores-forno.celo-testnet.org`

### Contract Not Found After Deploy
- **Error:** "Address has no code" when calling functions
- **Fix:** Wait 10-15 seconds for block confirmation, then retry

---

## Next: Move to Mainnet

Once testing is complete, deploy to **Celo Mainnet**:

1. Update `CELO_RPC_URL` in `.env.local`:
   ```env
   CELO_RPC_URL=https://forno.celo.org
   ```

2. Fund your deployer wallet on mainnet (~0.5 CELO for gas)

3. Run the same deployment script:
   ```bash
   forge script contracts/script/DeploySamelo.s.sol:DeploySamelo \
     --rpc-url https://forno.celo.org \
     --broadcast \
     --verify \
     --verifier-url https://api.celoscan.io/api \
     -vvv
   ```

4. Verify on https://celoscan.io (same process)

---

## Reference: Alfajores vs Mainnet

| Aspect | Alfajores (Testnet) | Mainnet |
|--------|-------------------|---------|
| RPC | https://alfajores-forno.celo-testnet.org | https://forno.celo.org |
| Chain ID | 44787 | 42220 |
| Block Explorer | https://alfajores.celoscan.io | https://celoscan.io |
| Native Token | testnet CELO | CELO |
| Faucet | https://faucet.celo.org | — |
| Cost | Free | $$ (real CELO) |
| Risk | None (test data) | Real funds |

---

## Files Changed During Testnet

(All `.env.local` and deployment files are `.gitignore`'d — safe to commit)

- `.env.local` — Testnet parameters
- `contracts/out/` — Build artifacts (ignored)
- Testnet contract addresses — Save in separate `.deployment.testnet.json` for reference
