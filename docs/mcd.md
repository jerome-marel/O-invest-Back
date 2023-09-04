:
:
:
ASSET_LIST: code_asset, symbol, name, sector

:
RÉALISER, 0N PORTFOLIO, 11 TRANSACTION
TRANSACTION: code_transaction, symbol, purchase_datetime, sell_datetime, asset_price, quantity, total_transacted, note
CHOISIT, 11 TRANSACTION, 0N ASSET_LIST

DETENIR, 0N USER, 11 PORTFOLIO
PORTFOLIO: code_portfolio, name, strategy, total_invested
CONCERNE, 11 TRANSACTION, 1N PORTFOLIO_ASSET
:

USER: code_user, first_name, last_name, email, password, risk_profile
EST COMPOSE, 0N PORTFOLIO, 11 PORTFOLIO_ASSET
PORTFOLIO_ASSET: code_portfolio_asset, symbol, name, remaining_quantity, historic_price
: