:
:
DETENIR, 0N USER, 11 PORTFOLIO
USER: code_user, first_name, last_name, email, password, risk_profile

:
RÉALISER, 0N PORTFOLIO, 11 TRANSACTION
PORTFOLIO: code_portfolio, name, strategy, total_invested
EST COMPOSE, 0N PORTFOLIO, 11 PORTFOLIO_ASSET

:
TRANSACTION: code_transaction, purchase_datetime, sell_datetime, asset_price, quantity, total_transacted, note
CONCERNE, 11 TRANSACTION, 1N PORTFOLIO_ASSET
PORTFOLIO_ASSET: code_portfolio_asset, symbol, name, remaining_quantity, historic_price

ASSET_LIST: code_asset, symbol, name
CHOISIT, 11 TRANSACTION, 0N ASSET_LIST
:
: