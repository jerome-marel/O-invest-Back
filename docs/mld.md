:
RÉALISER, 0N PORTFOLIO, 11 TRANSACTION
TRANSACTION: id, portfolio_id, asset_id, portfolio_asset_id, symbol, purchase_datetime, sell_datetime, asset_price, quantity, total_transacted, note, created_at, updated_at
CHOISIT, 11 TRANSACTION, 0N ASSET_LIST
ASSET_LIST: id, symbol, name, sector, created_at, updated_at

DETENIR, 0N USER, 11 PORTFOLIO
PORTFOLIO: id, user_id, name, strategy, total_invested, created_at, updated_at
CONCERNE, 11 TRANSACTION, 1N PORTFOLIO_ASSET
:
:

USER: id, first_name, last_name, email, password, risk_profile, created_at, updated_at
EST COMPOSE, 0N PORTFOLIO, 11 PORTFOLIO_ASSET
PORTFOLIO_ASSET: id, portfolio_id, symbol, name, remaining_quantity, historic_price, created_at, updated_at
:
: