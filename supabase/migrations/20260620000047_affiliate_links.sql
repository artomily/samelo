CREATE TABLE affiliate_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_wallet TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 5.00 CHECK (commission_pct > 0 AND commission_pct <= 50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES affiliate_campaigns(id) ON DELETE CASCADE,
  affiliate_wallet TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  conversion_count INTEGER NOT NULL DEFAULT 0,
  total_commission_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
  visitor_wallet TEXT,
  ip_hash TEXT,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  commission_melo NUMERIC(18, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX affiliate_links_wallet_idx ON affiliate_links (affiliate_wallet, created_at DESC);
CREATE INDEX affiliate_links_slug_idx ON affiliate_links (slug);
CREATE INDEX affiliate_clicks_link_idx ON affiliate_clicks (link_id, created_at DESC);
