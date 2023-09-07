/* eslint-env jest */
import portfolioController from './portfolioController.js';
import Portfolio from '../models/Portfolio.js';

jest.mock('../models/Portfolio');

// Mocking Portfolio.findAll for getAllPortfolios
Portfolio.findAll.mockImplementation(async () => [{ id: 1, name: 'Portfolio1' }]);

test('getAllPortfolios should return all portfolios', async () => {
  const req = { user: { id: 1 } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await portfolioController.getAllPortfolios(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'Successfully retrieved all portfolios', allPortfolios: [{ id: 1, name: 'Portfolio1' }] });
});

// Mocking Portfolio.create for createPortfolio
Portfolio.create.mockImplementation(async () => ({
  id: 2,
  name: 'Portfolio2',
}));

test('createPortfolio should create a new portfolio', async () => {
  const req = {
    user: { id: 1 },
    body: {
      name: 'Portfolio2',
      strategy: 'Long-term',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await portfolioController.createPortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'New portfolio successfully added', newPortfolio: { id: 2, name: 'Portfolio2' } });
});

// Mocking Portfolio.findOne for updatePortfolio
Portfolio.findOne.mockImplementation(async () => ({
  id: 1,
  name: 'Portfolio1',
  save: jest.fn(),
}));

test('updatePortfolio should update an existing portfolio', async () => {
  const req = {
    user: { id: 1 },
    params: { id: 1 },
    body: {
      name: 'Updated Portfolio',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await portfolioController.updatePortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Portfolio updated successfully' }));
});

// Mocking for deletePortfolio
Portfolio.findOne.mockImplementation(async () => ({
  id: 1,
  name: 'Portfolio1',
  destroy: jest.fn(),
}));

test('deletePortfolio should delete a portfolio', async () => {
  const req = {
    user: { id: 1 },
    params: { id: 1 },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await portfolioController.deletePortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio deleted successfully' });
});
