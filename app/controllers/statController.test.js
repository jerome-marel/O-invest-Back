/* eslint-disable max-len */
/* eslint-env jest */
import statController from './statController.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

// Mocking your models
jest.mock('../models/Portfolio');
jest.mock('../models/PortfolioAsset');
jest.mock('../models/Transaction');

describe('statController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('allPortfoliosStats', () => {
    it('should return all portfolios stats', async () => {
      Portfolio.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]); // Mock value
      const result = await statController.allPortfoliosStats();
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });

  describe('getOnePortfolioStats', () => {
    it('should get one portfolio stats', async () => {
      Portfolio.findOne.mockResolvedValue({ id: 1 }); // Mock value
      const result = await statController.getOnePortfolioStats(1);
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });

  describe('averagePurchasePrice', () => {
    it('should calculate average purchase price', async () => {
      Transaction.findAll.mockResolvedValue([{ amount: 100 }, { amount: 200 }]); // Mock value
      const result = await statController.averagePurchasePrice();
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });

  describe('getPortfolioWeight', () => {
    it('should get portfolio weight', async () => {
      Portfolio.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]); // Mock value
      const result = await statController.getPortfolioWeight();
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });

  describe('getProfitLossAsset', () => {
    it('should get profit and loss per asset', async () => {
      PortfolioAsset.findAll.mockResolvedValue([{ asset: 'AAPL', profit: 10 }]); // Mock value
      const result = await statController.getProfitLossAsset();
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });

  describe('getRanking', () => {
    it('should get the ranking', async () => {
      Portfolio.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]); // Mock value
      const result = await statController.getRanking();
      expect(result).toBeTruthy(); // Replace with your actual assertions
    });
  });
});
