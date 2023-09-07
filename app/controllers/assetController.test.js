/* eslint-env jest */
import axios from 'axios';
import assetController from './assetController.js';
import AssetList from '../models/AssetList.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

jest.mock('axios');
jest.mock('../models/AssetList');
jest.mock('../models/Portfolio');
jest.mock('../models/PortfolioAsset');
jest.mock('../models/Transaction');

// Mocks
AssetList.findAll.mockImplementation(async () => [
  {
    id: 1, symbol: 'AAPL', name: 'Apple', sector: 'Tech',
  },
]);

Portfolio.findOne.mockImplementation(async () => ({ id: 1, user_id: 1, totalInvested: 0 }));

PortfolioAsset.findOne.mockImplementation(async () => null);

Transaction.findOne.mockImplementation(async () => null);

axios.get.mockResolvedValue({ data: { values: [{ open: 150 }] } });

const reqTemplate = {
  user: { id: 1 },
  params: { id: 1 },
  body: {},
};

const resTemplate = {
  status: jest.fn(() => resTemplate),
  json: jest.fn(),
};

// Tests
test('getAllAssets should return all assets', async () => {
  const req = { ...reqTemplate };
  const res = { ...resTemplate };

  await assetController.getAllAssets(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'All assets successfully retrieved',
    cleanedAssets: [{
      id: 1, symbol: 'AAPL', name: 'Apple', sector: 'Tech',
    }],
  });
});

test('addAssetToPortfolio should add asset', async () => {
  const req = {
    ...reqTemplate,
    body: {
      symbol: 'AAPL',
      purchaseDatetime: '2023-08-26',
      quantity: 10,
      note: 'Test note',
    },
  };
  const res = { ...resTemplate };

  await assetController.addAssetToPortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
});

test('deleteAssetFromPortfolio should delete asset', async () => {
  PortfolioAsset.findOne.mockImplementation(async () => ({ remainingQuantity: 20 }));
  Transaction.findOne.mockImplementation(async () => ({ assetPrice: 150 }));

  const req = {
    ...reqTemplate,
    body: {
      symbol: 'AAPL',
      quantityToRemove: 10,
    },
  };
  const res = { ...resTemplate };

  await assetController.deleteAssetFromPortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});
