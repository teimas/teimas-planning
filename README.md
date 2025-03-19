# Planning Teimas

Multiplatform planning application by Teimas.

## Environment Setup

This project uses environment variables for configuration settings, including Firebase credentials.

### Setting up environment variables

1. Run the setup script:
   ```bash
   npm run setup-env
   ```

2. This will create a `.env` file based on `.env.example`.

3. Update the `.env` file with your actual Firebase configuration values.

## Firebase Configuration

Firebase configuration has been moved to environment variables for improved security. The configuration is stored in:
- Firebase configuration files:
  - `firebase/config.ts`
  - `src/firebase/config.ts`

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## CI/CD

This project includes a GitHub Actions workflow in `.github/workflows/ci.yml` that:
1. Runs linting
2. Runs tests with coverage
3. Validates Firebase configuration
4. Uploads coverage reports as artifacts

### Setting up GitHub Secrets

For the GitHub Actions workflow to work correctly, you need to add the following secrets in your GitHub repository:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_DATABASE_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

To add these secrets:
1. Go to your GitHub repository
2. Click on "Settings"
3. In the sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Add each secret with its corresponding value

## License

Private © Teimas
