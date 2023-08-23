import Transaction from './Transaction.js';
import Portfolio from './Portfolio.js';
import User from './User.js';
import AssetList from './AssetList.js';
import PortfolioAsset from './PortfolioAsset.js';

// association entre portfolio et transaction
// un portfolio peut avoir plusieurs transactions

Portfolio.hasMany(Transaction, {
  as: 'transactionInPortfolio', // à partir de Portfolio, je veux récupérer les transactions
  foreignKey: 'porfolio_id',
});

// une transaction ne peut concerner qu'un portfolio

Transaction.belongsTo(Portfolio, {
  as: 'portfolio', // à partir de Transaction, je veux le portfolio concerné
  foreignKey: 'portfolio_id',
});

// user & portfolio associations
User.hasMany(Portfolio, {
  as: 'userPortfolios', // depuis User, je veux ses portfolios.
  foreignKey: 'user_id',
});

Portfolio.belongsTo(User, {
  as: 'user', // depuis Portfolio, je souhaite recuperer l'user
  foreignKey: 'user_id',
});

// Portfolio & PortfolioAsset association

Portfolio.hasMany(PortfolioAsset, {
  as: 'assetsInPortfolio',
  foreignKey: 'portfolio_id',

});

PortfolioAsset.belongsTo(Portfolio, {
  as: 'portfolio',
  foreignKey: 'portfolio_id',
});

// association entre transaction et asset list
// une transaction porte sur un seule asset

Transaction.belongsTo(AssetList, {
  as: 'asset', // à partir de Transaction, je veux récupérer l'asset concerné
  foreignKey: 'asset_id',
});

AssetList.hasMany(Transaction, {
  as: 'transactions',
  foreignKey: 'asset_id',
});

// association entre Transaction et PortfolioAsset

Transaction.belongsTo(PortfolioAsset, {
  as: 'portfolioAsset', // à partir de transaction je veux récuprer l'asset en portefeuille
  foreignKey: 'portfolio_asset_id',
});

PortfolioAsset.hasMany(Transaction, {
  as: 'transactionsInPortfolioAsset',
  foreignKey: 'portfolio_asset_id',
});

export default {
  User, Portfolio, Transaction, AssetList, PortfolioAsset,
};
