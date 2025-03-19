const fs = require('fs');
const path = require('path');

// Read the example environment file
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envPath = path.join(__dirname, '..', '.env');

// Check if .env file already exists
if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Skipping creation.');
  process.exit(0);
}

// Read the example file
const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Create the .env file
fs.writeFileSync(envPath, envExample);

console.log(`
.env file created successfully!

Please update the values in .env with your Firebase configuration.
You can find these values in your Firebase Console:
1. Go to Project Settings
2. Under "Your apps", find your web app
3. Copy the configuration values

Remember to never commit the .env file to version control!
`); 