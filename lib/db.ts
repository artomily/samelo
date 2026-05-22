import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'samelo.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  _db.exec(`
    CREATE TABLE IF NOT EXISTS watches (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address  TEXT    NOT NULL,
      video_id        TEXT    NOT NULL,
      reward_cents    INTEGER NOT NULL,
      watched_at      INTEGER NOT NULL DEFAULT (strftime('%s','now')),
      claimed         INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_watches_wallet
      ON watches(wallet_address);

    CREATE INDEX IF NOT EXISTS idx_watches_wallet_video
      ON watches(wallet_address, video_id);
  `)

  return _db
}

export interface WatchRow {
  id: number
  wallet_address: string
  video_id: string
  reward_cents: number
  watched_at: number
  claimed: number
}
