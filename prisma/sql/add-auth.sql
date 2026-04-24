-- Auth tables for Google SSO + refresh token rotation
-- Apply via: psql $DATABASE_URL -f prisma/sql/add-auth.sql
-- Or just run: npx prisma db push

CREATE TABLE IF NOT EXISTS "users" (
  "id"            TEXT PRIMARY KEY,
  "email"         VARCHAR(255) NOT NULL UNIQUE,
  "name"          VARCHAR(255),
  "picture"       TEXT,
  "google_sub"    VARCHAR(64)  NOT NULL UNIQUE,
  "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  "last_login_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id"          TEXT PRIMARY KEY,
  "user_id"     TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash"  VARCHAR(128) NOT NULL UNIQUE,
  "expires_at"  TIMESTAMPTZ  NOT NULL,
  "revoked_at"  TIMESTAMPTZ,
  "replaced_by" VARCHAR(64),
  "user_agent"  TEXT,
  "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx"    ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
