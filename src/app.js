const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const notesRoutes = require('./routes/notesRoutes');

// Initialize Express application
const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Enable CORS (Cross-Origin Resource Sharing) for client integration
app.use(cors());

// HTTP request logger middleware for development
app.use(morgan('dev'));

// Parse incoming JSON request bodies (req.body)
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static frontend dashboard from the /public folder
app.use(express.static(path.join(__dirname, '../public')));

// ============================================================================
// API ROUTES
// ============================================================================

// Mount notes CRUD routes under /api/notes
app.use('/api/notes', notesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API metadata endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Notes REST API',
    version: '1.0.0',
    description: 'A RESTful API built with Node.js and Express',
    endpoints: {
      'GET /api/notes': 'Fetch all notes (optional query params: ?search= & ?category=)',
      'GET /api/notes/:id': 'Fetch a single note by ID',
      'POST /api/notes': 'Create a new note (requires title, content; optional category)',
      'PUT /api/notes/:id': 'Update an existing note by ID',
      'DELETE /api/notes/:id': 'Delete a note by ID',
      'GET /health': 'Check server status'
    }
  });
});

// ============================================================================
// 404 & ERROR HANDLING MIDDLEWARE
// ============================================================================

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // Handle malformed JSON body errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload received in request body'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
