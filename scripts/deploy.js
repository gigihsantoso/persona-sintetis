#!/usr/bin/env node
/**
 * Node.js Deployment Script for Persona Sintetis
 * Cross-platform deployment script
 * Usage: npm run deploy
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

function log(message, color = reset) {
  console.log(`${color}${message}${reset}`);
}

function exec(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

log('========================================', cyan);
log('  Persona Sintetis - Deployment Script', cyan);
log('========================================', cyan);
log('');

// Step 1: Install dependencies
log('[1/5] Installing dependencies...', yellow);
if (!exec('npm install')) {
  log('ERROR: npm install failed', red);
  process.exit(1);
}

// Step 2: Build Angular application
log('');
log('[2/5] Building Angular application...', yellow);
if (!exec('npm run build')) {
  log('ERROR: Build failed', red);
  process.exit(1);
}

// Step 3: Verify build output
log('');
log('[3/5] Verifying build output...', yellow);
const buildPath = path.join(__dirname, '..', 'dist', 'persona-sintetis', 'browser');
if (!fs.existsSync(buildPath)) {
  log(`ERROR: Build directory not found at ${buildPath}`, red);
  process.exit(1);
}

if (!fs.existsSync(path.join(buildPath, 'index.html'))) {
  log('ERROR: index.html not found in build directory', red);
  process.exit(1);
}

log('✓ Build verified successfully', green);

// Step 4: Check Express dependencies
log('');
log('[4/5] Checking Express server dependencies...', yellow);
const expressPath = path.join(__dirname, '..', 'node_modules', 'express');
if (!fs.existsSync(expressPath)) {
  log('Installing Express...', yellow);
  if (!exec('npm install express')) {
    log('ERROR: Express installation failed', red);
    process.exit(1);
  }
} else {
  log('✓ Express already installed', green);
}

// Step 5: Complete
log('');
log('[5/5] Deployment complete!', green);
log('');
log('To start the server, run:', cyan);
log('  npm run serve', reset);
log('');
log('To start Cloudflare Tunnel, run:', cyan);
log('  npm run tunnel', reset);
log('');
