const app = require('./src/app');

// Port configuration (defaults to 3000 if not specified in environment)
const PORT = process.env.PORT || 3000;

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log('='.repeat(55));
  console.log(`🚀 Notes REST API server is running on port ${PORT}`);
  console.log(`📡 Base URL:          http://localhost:${PORT}`);
  console.log(`📖 Interactive Docs:  http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:     http://localhost:${PORT}/api/notes`);
  console.log(`❤️  Health Check:     http://localhost:${PORT}/health`);
  console.log('='.repeat(55));
});

// Handle graceful shutdown on termination signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
});
