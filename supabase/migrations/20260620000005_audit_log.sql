-- Immutable audit log for security-sensitive admin actions
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_wallet TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log (actor_wallet, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action, created_at DESC);

-- Prevent modification of audit records
CREATE RULE audit_log_no_update AS ON UPDATE TO audit_log DO INSTEAD NOTHING;
CREATE RULE audit_log_no_delete AS ON DELETE TO audit_log DO INSTEAD NOTHING;

COMMENT ON TABLE audit_log IS 'Immutable audit trail for admin and security-sensitive actions';
