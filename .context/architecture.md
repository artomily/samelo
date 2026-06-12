# Samelo Architecture

## System Overview

Samelo is a watch-to-earn platform on Celo. Users watch sponsored videos, earn points, and swap points for CELO. No KYC, no seed phrases — MiniPay native.

## Core Components

### Frontend (Next.js 16 App Router)
- **App Shell**: `(app)/layout.tsx` — ChainGuard + BottomNav
- **Landing**: `(landing)/page.tsx` — Hero, Features, FAQ, CTA
- **Watch**: `(app)/watch/page.tsx` — Video feed + progress tracking
- **Swap**: `(app)/swap/page.tsx` — Points → CELO on-chain swap
- **Earnings**: `(app)/earnings/page.tsx` — History dashboard
- **Leaderboard**: `(app)/leaderboard/page.tsx` — Top earners + top viewers
- **Profile**: `(app)/profile/page.tsx` — Wallet + referral program
- **Quiz**: `(app)/quiz/[videoId]/page.tsx` — Post-video quiz for bonus points

### API Routes (Next.js)
- `/api/watch/token` — HMAC-signed watch session
- `/api/watch/complete` — Credit points after 95% watch
- `/api/rewards/swapauth` — Oracle-signed swap payload
- `/api/rewards/claimable` — Check claimable balance
- `/api/rewards/confirm-claim` — Mark points as claimed
- `/api/rewards/earn-points` — Click-to-earn (SameloPoints contract)
- `/api/referral` — GET stats, POST redeem code
- `/api/leaderboard` — Rankings
- `/api/quiz/submit` — Quiz answer + bonus points
- `/api/videos` — Video catalog

### Smart Contracts (Solidity 0.8.24, Foundry)
- **SameloTreasury** (`0x6F5D…`) — UUPS proxy, fund manager, 90/10 split
- **SameloSwap** (`0x7774…`) — UUPS proxy, points→CELO swap, oracle-verified
- **SameloPoints** (`0xbCd8…`) — UUPS proxy, on-chain points, click-to-earn

### Database (Supabase Postgres)
- **profiles** — wallet_address PK, referral_code, total_points, streak
- **watches** — per-video watch records with reward_cents + points
- **referrals** — referrer→referred tracking with reward_points + trigger
- **claims** — on-chain claim records with tx_hash
- **videos** — content catalog
- **video_summaries** — AI-generated summaries

### Edge Functions (Supabase)
- `summarize-video` — AI video summarization

## Key Flows

### Watch & Earn
1. Frontend requests `/api/watch/token` → HMAC session token
2. User watches video ≥ 95%
3. Frontend calls `/api/watch/complete` → points credited to `watches` table
4. Trigger updates `profiles.total_points`

### Swap Points → CELO
1. Frontend calls `/api/rewards/swapauth` → oracle ECDSA signature
2. User submits `swapPoints()` to SameloSwap contract
3. Contract verifies oracle sig, checks cooldown/limits
4. Treasury releases CELO to user wallet
5. Frontend calls `/api/rewards/confirm-claim` → marks points claimed

### Referral
1. User shares `?ref=CODE` link
2. `ReferralCapture` stores code in localStorage
3. New user connects wallet → redeems code via `/api/referral` POST
4. DB trigger awards 50 pts to referrer's `total_points`

## Anti-Abuse
- HMAC watch session tokens (server-side)
- Deduplication on `watches` (composite unique)
- 95% completion threshold
- Minimum 500 pts swap, 1-day cooldown
- Nonce anti-replay on-chain
- Oracle ECDSA signature verification

## Design Decisions
- **UUPS over Transparent Proxy**: Cheaper deploys, upgrade logic in implementation
- **Off-chain points + on-chain swap**: Points tracked in Supabase for speed; swap requires oracle sig for on-chain verification
- **HMAC tokens over JWT**: Simpler, no library dependency, server-only secret
- **Celo mainnet-only for prod**: MiniPay has native Celo support; testnet optional for dev