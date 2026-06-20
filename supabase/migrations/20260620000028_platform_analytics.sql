CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT,
  path TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  feature TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX page_views_path_idx ON page_views (path, created_at DESC);
CREATE INDEX feature_usage_feature_idx ON feature_usage (feature, created_at DESC);
CREATE INDEX feature_usage_wallet_idx ON feature_usage (wallet, created_at DESC);
