BEGIN;
DROP TABLE IF EXISTS "user",
"portfolio",
"transaction",
"asset_list",
"portfolio_asset";
CREATE TABLE IF NOT EXISTS "user" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "risk_profile" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);
CREATE TABLE "portfolio" (
  "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "user"("id"),
  "name" TEXT NOT NULL,
  "strategy" TEXT NOT NULL,
  "total_invested" DECIMAL (9,2) DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);
CREATE TABLE "asset_list" (
 "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 "symbol" TEXT NOT NULL,
 "name" TEXT NOT NULL,
 "sector" TEXT,
 "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMPTZ,
 CONSTRAINT "unique_symbol" UNIQUE ("symbol")
);
CREATE TABLE "portfolio_asset" (
  "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "portfolio_id" INTEGER NOT NULL REFERENCES "portfolio"("id"),
  "symbol" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "remaining_quantity" decimal (9,2) NOT NULL,
  "historic_price" decimal (7,2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);
CREATE TABLE "transaction" (
 "id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 "portfolio_id" INTEGER NOT NULL REFERENCES "portfolio"("id"),
 "asset_id" INTEGER NOT NULL REFERENCES "asset_list"("id"),
 "portfolio_asset_id" INTEGER NOT NULL REFERENCES "portfolio_asset"("id"),
 "purchase_datetime" timestamptz NOT NULL,
 "sell_datetime" timestamptz,
 "asset_price" decimal (7,2) NOT NULL,
 "quantity" INTEGER NOT NULL,
 "total_transacted" decimal (9,2) NOT NULL,
 "note" TEXT,
 "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMPTZ
);

COMMIT;