const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4300;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Readiness check endpoint
app.get('/ready', (req, res) => {
  const distPath = path.join(__dirname, 'dist', 'persona-sintetis', 'browser');
  const indexExists = fs.existsSync(path.join(distPath, 'index.html'));
  
  if (indexExists) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      reason: 'build_not_found',
      timestamp: new Date().toISOString()
    });
  }
});

// Metrics endpoint for monitoring
app.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  res.status(200).json({
    timestamp: new Date().toISOString(),
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100 + ' MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100 + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100 + ' MB'
    },
    uptime: process.uptime(),
    pid: process.pid
  });
});

// Serve static files from Angular build
const distPath = path.join(__dirname, 'dist', 'persona-sintetis', 'browser');

// Check if build exists
if (!fs.existsSync(distPath)) {
  console.warn(`⚠️  Warning: Build directory not found at ${distPath}`);
  console.warn('   Run "npm run build" to create the production build.');
  console.warn('   Server will start but return 404 for all routes except /health, /ready, /metrics');
}

// Serve static assets
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'Not Found',
      message: 'Application build not found. Please run "npm run build" first.',
      health_check: '/health',
      ready_check: '/ready'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Ready check:  http://localhost:${PORT}/ready`);
  console.log(`   Metrics:      http://localhost:${PORT}/metrics`);
  console.log(`   App:          http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
