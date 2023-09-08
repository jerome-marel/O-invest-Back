/* eslint-env jest */
import portfolioController from './portfolioController.js';
import Portfolio from '../models/Portfolio.js';

jest.mock('../models/Portfolio');

// Mocking Portfolio.findAll for getAllPortfolios

Portfolio.findAll.mockImplementation(async () => [{ id: 1, name: 'Portfolio1' }]);

// Test for getAllPortfolios
test('getAllPortfolios should return all portfolios', async () => {
  const req = { user: { id: 1 } };// Create a mock request object with a user ID.
  const res = {
    status: jest.fn(() => res), // Create mock res object with a status function that returns itself
    json: jest.fn(), // Create a mock res object with a json function.
  };

  // Call the getAllPortfolios with the mock req and res objects
  await portfolioController.getAllPortfolios(req, res);

  // Assert that the res status code and JSON match the expected values.
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'Successfully retrieved all portfolios', allPortfolios: [{ id: 1, name: 'Portfolio1' }] });
});

// Mocking Portfolio.create for createPortfolio

// Mock the create method to return a specific new portfolio object.
Portfolio.create.mockImplementation(async () => ({
  id: 2,
  name: 'Portfolio2',
}));

// Test for createPortfolio function
test('createPortfolio should create a new portfolio', async () => {
  const req = {
    user: { id: 1 },
    body: {
      name: 'Portfolio2',
      strategy: 'Long-term',
    },
  };

  const res = {
    // Create a mock res object with a status function that returns itself.
    // Create a mock res object with a json function.
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await portfolioController.createPortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'New portfolio successfully added', newPortfolio: { id: 2, name: 'Portfolio2' } });
});

// Mocking for deletePortfolio
Portfolio.findOne.mockImplementation(async () => ({
  id: 1,
  name: 'Portfolio1',
  destroy: jest.fn(),
}));

// Test for deletePortfolio function
// Create a mock request object with user ID and parameters.

test('deletePortfolio should delete a portfolio', async () => {
  const req = {
    user: { id: 1 },
    params: { id: 1 },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  // Call the deletePortfolio function with the mock request and response objects.
  await portfolioController.deletePortfolio(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio deleted successfully' });
});
