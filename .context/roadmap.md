# Samelo Roadmap

## Phase 1 — Core Platform ✅
- [x] Celo Mainnet deployment (Treasury + Swap + Points)
- [x] UUPS upgradeable contracts
- [x] Points → CELO swap flow
- [x] Watch progress tracking (95% completion)
- [x] ChainGuard for network enforcement
- [x] MiniPay auto-connect
- [x] Landing page (Hero, Features, FAQ, CTA)
- [x] Leaderboard (Top Earners + Top Viewers)
- [x] Quiz system with bonus points
- [x] Earnings history
- [x] Video summaries (AI-generated)

## Phase 2 — Growth & Engagement 🔄
- [ ] **Referral system** ← CURRENT
  - [x] Database schema (profiles.referral_code, referrals table)
  - [x] API routes (GET/POST /api/referral)
  - [x] ReferralCapture component (URL param → localStorage)
  - [x] Profile page: code display, copy link, redeem input, stats
  - [ ] Auto-redeem on wallet connect
  - [ ] Web Share API for mobile sharing
  - [ ] Bonus for referred user (both sides get reward)
  - [ ] Toast notifications on referral events
  - [ ] useReferral hook (extract from ProfilePage)
  - [ ] API tests (Vitest)
- [ ] **$MELO token launch + wire to Points**
- [ ] **Multi-language (EN / ES / SW)**
- [ ] **Mission system (watch all videos → bonus)**

## Phase 3 — Scale
- [ ] Advertiser dashboard
- [ ] Video upload pipeline
- [ ] Analytics & reporting
- [ ] Push notifications (MiniPay)
- [ ] Social features (following, comments)