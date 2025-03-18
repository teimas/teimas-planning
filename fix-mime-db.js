const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'node_modules', 'mime-db', 'db.json');
const dirPath = path.join(__dirname, 'node_modules', 'mime-db');

// Create minimal db.json if it doesn't exist
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
  console.log('Created mime-db directory');
}

if (!fs.existsSync(dbPath)) {
  // Create a minimal db.json file with common MIME types
  const minimalDb = {
    'application/json': {
      'source': 'iana',
      'charset': 'UTF-8',
      'compressible': true,
      'extensions': ['json', 'map']
    },
    'text/html': {
      'source': 'iana',
      'charset': 'UTF-8',
      'compressible': true,
      'extensions': ['html', 'htm']
    },
    'text/plain': {
      'source': 'iana',
      'charset': 'UTF-8',
      'compressible': true,
      'extensions': ['txt', 'text', 'conf', 'def', 'list', 'log']
    }
  };
  
  fs.writeFileSync(dbPath, JSON.stringify(minimalDb, null, 2));
  console.log('Created minimal db.json file');
}

console.log('mime-db fix complete'); 