import axios from 'axios';
import '../app/utils/env.load.js';

import pkg from 'pg';

const { Client } = pkg;

const dbParams = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
};

const stockListUrl = 'https://api.twelvedata.com/stocks?country=us&exchange=nasdaq&type=common-stock&mic_code=xngs';

export async function fetchAndUpdateStocks() {
  const client = new Client(dbParams);
  await client.connect();

  try {
    const response = await axios.get(stockListUrl);
    const stocks = response.data.data;

    for (const stock of stocks) {
      const { symbol } = stock;
      const { name } = stock;

      const query = 'INSERT INTO asset_list (symbol, name) VALUES ($1, $2) ON CONFLICT (symbol) DO NOTHING';
      await client.query(query, [symbol, name]);
    }

    console.log('BDD mise à jour!!!!!!!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}
