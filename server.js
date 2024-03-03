const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(bodyParser.json());

app.get('/api/customers', async (req, res) => {
  console.log("heyy");
  try {
    const result = await pool.query('SELECT * FROM customers');
    console.log(result.rows);
    res.json(result.rows.map((customer, index) => ({ ...customer, sno: index + 1 })));
    
  } 
  catch (error) {
    console.error('Error fetching customers', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log('Server is running on port ${port}');
});