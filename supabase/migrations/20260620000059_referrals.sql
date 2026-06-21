CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  bonus_melo INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  max_uses INTEGER,
  total_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE referral_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID NOT NULL REFERENCES referral_codes(id),
  referred_wallet TEXT NOT NULL UNIQUE,
  bonus_paid BOOLEAN NOT NULL DEFAULT FALSE,
  converted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX referral_codes_code_idx ON referral_codes (code);
CREATE INDEX referral_conversions_code_idx ON referral_conversions (referral_code_id, converted_at DESC);
