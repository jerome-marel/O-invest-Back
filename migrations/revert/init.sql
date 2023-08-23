-- Revert o-invest:init from pg

BEGIN;

DROP TABLE "user";
DROP TABLE "portfolio";
DROP TABLE "transaction";
DROP TABLE "asset_list";
DROP TABLE "portfolio_asset";

COMMIT;