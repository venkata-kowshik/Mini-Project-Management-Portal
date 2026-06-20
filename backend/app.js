const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Main application API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Server landing check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Management Portal API' });
});

// Global internal error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred' });
});

module.exports = app;
