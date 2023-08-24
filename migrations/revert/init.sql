-- Revert o-invest:init from pg

BEGIN;

DROP TABLE "transaction" CASCADE;
DROP TABLE "portfolio_asset" CASCADE;
DROP TABLE "portfolio";
DROP TABLE "asset_list";
DROP TABLE "user";

COMMIT;