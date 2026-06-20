CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  uses INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT NOT NULL,
  referee_wallet TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  referrer_bonus INTEGER NOT NULL DEFAULT 0,
  referee_bonus INTEGER NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX referrals_referrer_idx ON referrals (referrer_wallet);
CREATE INDEX referral_codes_code_idx ON referral_codes (code);
