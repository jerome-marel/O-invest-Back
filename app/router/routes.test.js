/* eslint-env jest */
import request from 'supertest';
import app from '../app.js'; // Make sure you're importing your express app configuration

// Routes for Register & Login.

describe('API Routes for register and login', () => {
  test('GET / should return greeting', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
  });
  // Test for  Register Controller Routes

  test('POST /api/register responds with 201', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'securePassword',
        passwordConfirm: 'securePassword',
        riskProfile: 'low',
      });
    expect(response.statusCode).toBe(201);
  });

  // Test for Login Route
  test('POST /api/login responds with 201', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'john.doe@gmail.com',
        password: 'securePassword',
      });
    expect(response.statusCode).toBe(201);
  });
});

// Tests for Portfolio and Assets controllers routes

describe('API Routes for Portfolio and Assets', () => {
  // Portfolio Tests
  test('GET /api/portfolio should respond with 200', async () => {
    const response = await request(app).get('/api/portfolio');
    expect(response.status).toBe(200);
  });

  test('POST /api/portfolio should respond with 201', async () => {
    const response = await request(app)
      .post('/api/portfolio')
      .send({
        name: 'My Portfolio',
        description: 'This is my test portfolio',
        riskLevel: 'Low',
        userId: 1,
      });
    expect(response.status).toBe(201);
  });

  // Asset Tests
  test('GET /api/assets should respond with 200', async () => {
    const response = await request(app).get('/api/assets');
    expect(response.status).toBe(200);
  });

  test('POST /api/assets/addToPortfolio should respond with 201', async () => {
    const response = await request(app)
      .post('/api/assets/addToPortfolio')
      .send({
        portfolioId: 1,
        assetId: 'AAPL',
        quantity: 5,
        purchasePrice: 150.00,
        purchaseDate: '2023-08-25',
      });
    expect(response.status).toBe(201);
  });
});

// Tests for Stat Controller routes.

describe('API Routes for Stat Controller', () => {
  test('GET /api/allPortfoliosStats should respond with 200', async () => {
    const response = await request(app).get('/api/allPortfoliosStats');
    expect(response.status).toBe(200);
  });

  test('GET /api/getOnePortfolioStats/:id should respond with 200', async () => {
    const response = await request(app).get('/api/getOnePortfolioStats/1');
    expect(response.status).toBe(200);
  });

  test('GET /api/averagePurchasePrice should respond with 200', async () => {
    const response = await request(app).get('/api/averagePurchasePrice');
    expect(response.status).toBe(200);
  });

  test('GET /api/getPortfolioWeight should respond with 200', async () => {
    const response = await request(app).get('/api/getPortfolioWeight');
    expect(response.status).toBe(200);
  });

  test('GET /api/getProfitLossAsset should respond with 200', async () => {
    const response = await request(app).get('/api/getProfitLossAsset');
    expect(response.status).toBe(200);
  });

  test('GET /api/getRanking should respond with 200', async () => {
    const response = await request(app).get('/api/getRanking');
    expect(response.status).toBe(200);
  });
});
