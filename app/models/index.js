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
