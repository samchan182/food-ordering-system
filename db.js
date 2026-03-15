import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'food-ordering-db',
  password: 'Aaq112211',
  port: 5432,
});

export default pool;
