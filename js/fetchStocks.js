/* eslint-disable no-restricted-syntax */
import axios from 'axios';
import '../app/utils/env.load.js';
import pkg from 'pg';
import logger from '../app/utils/logger.js';

const { Client } = pkg;

const dbParams = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
};

const stockListUrl = 'https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=471fa8c65e322f88f37e9dd48bd3766c';

const fetchAndUpdateStocks = async () => {
  const client = new Client(dbParams);
  await client.connect();

  try {
    const response = await axios.get(stockListUrl);
    const stocks = response.data;

    for (const stock of stocks) {
      const { symbol, name, sector } = stock;
      const query = 'INSERT INTO asset_list (symbol, name, sector) VALUES ($1, $2, $3) ON CONFLICT (symbol) DO NOTHING';
      // eslint-disable-next-line no-await-in-loop
      await client.query(query, [symbol, name, sector]);
    }

    logger.info('******** Nasdaq Assets Updated ********');
  } catch (error) {
    logger.error('Error:', error);
  } finally {
    await client.end();
  }
};

export default fetchAndUpdateStocks;
