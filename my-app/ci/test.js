const fs = require('fs');
const assert = require('assert');
const path = require('path');

// Basic smoke tests to validate repository structure and scripts
function exists(p) {
  return fs.existsSync(path.join(__dirname, '..', p));
}

try {
  // Ensure main entry points exist (basic sanity checks)
  assert.ok(exists('package.json'), 'package.json must exist');
  assert.ok(exists('src/pages/index.tsx') || exists('src/pages/index.js'), 'src/pages/index should exist');

  console.log('Basic checks passed');
  process.exit(0);
} catch (err) {
  console.error('Test failure:', err.message);
  process.exit(1);
}
