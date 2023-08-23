import Transaction from './Transaction.js';
import Portfolio from './Portfolio.js';

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
