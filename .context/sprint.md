# Sprint: Referral System Completion

**Started**: 2026-06-13
**Focus**: Complete the referral system (Phase 2, Growth & Engagement)

## Current State

The referral system has the foundation but is incomplete:
- ✅ DB schema: `profiles.referral_code`, `referrals` table with trigger
- ✅ API: GET/POST `/api/referral`
- ✅ UI: `ReferralCapture` (URL→localStorage), Profile page with code display + redeem
- ❌ Auto-redeem on wallet connect (user must manually click)
- ❌ Share button (Web Share API for mobile-first)
- ❌ Reciprocal rewards (referred user gets nothing)
- ❌ Toast feedback
- ❌ Custom hook (`useReferral`)
- ❌ API tests

## Tasks

### 1. useReferral hook — extract from ProfilePage
- Move referral state + fetch/redeem/copy logic to `hooks/useReferral.ts`
- ProfilePage consumes the hook

### 2. Auto-redeem on wallet connect
- When user connects wallet AND has `samelo_ref_code` in localStorage
- Auto-call POST `/api/referral` with the stored code
- Show toast on success/failure
- Clear localStorage after successful redemption

### 3. Web Share API button
- Add Share button alongside Copy button in ProfilePage
- Use `navigator.share()` on mobile, fallback to copy
- Share text: "Watch videos & earn CELO on Samelo! Use my referral code: {CODE}"

### 4. Reciprocal rewards
- Update POST `/api/referral` to also credit 25 pts to referred user
- Or use a DB trigger approach (cleaner)
- Update migration

### 5. Toast notifications
- Use existing `ToastProvider` for referral events
- Toast on: auto-redeem success, copy link, share success

### 6. API tests
- Vitest tests for GET/POST `/api/referral`
- Mock Supabase client
- Test: valid code, invalid code, self-referral, already-referred

## Progress Log

- 2026-06-13: Sprint started. Created .context/ architecture, roadmap, sprint docs.
- 2026-06-13: Created `useReferral` hook — extrats referral state, fetch, redeem, copy, share logic from ProfilePage.
- 2026-06-13: Refactored ProfilePage to use `useReferral` hook.
- 2026-06-13: Added Web Share API button on Profile (mobile-first sharing).
- 2026-06-13: Added auto-redeem on wallet connect (reads localStorage `samelo_ref_code`).
- 2026-06-13: Added Toast notifications for referral events (copy, share, redeem success/error).
- 2026-06-13: Enhanced referral reward: referred user gets 25 bonus pts (via DB trigger), referrer gets 50 pts.
- 2026-06-13: Added migration `20260613000001_referral_referred_bonus.sql`.
- 2026-06-13: Updated i18n (en, sw, es) — added `leaderboardTopEarners`, `leaderboardTopViewers`, `referralShareButton`, `referralShareText`, updated `referralRedeemed` to reflect 25 pts bonus.