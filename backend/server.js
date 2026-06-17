require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});

app.locals.db = pool;

// Import Routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

// Bind Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/dsa', require('./routes/dsa'));
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'InstantPrep API is active' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server booting up on port ${PORT}`);
});
