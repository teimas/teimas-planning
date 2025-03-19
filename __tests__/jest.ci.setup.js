// CI-specific Jest setup

// Mock process.env for Firebase config in CI environment if needed
const mockFirebaseConfig = {
  FIREBASE_API_KEY: 'mock-api-key',
  FIREBASE_AUTH_DOMAIN: 'mock-auth-domain',
  FIREBASE_DATABASE_URL: 'mock-database-url',
  FIREBASE_PROJECT_ID: 'mock-project-id',
  FIREBASE_STORAGE_BUCKET: 'mock-storage-bucket',
  FIREBASE_MESSAGING_SENDER_ID: 'mock-sender-id',
  FIREBASE_APP_ID: 'mock-app-id',
  FIREBASE_MEASUREMENT_ID: 'mock-measurement-id',
};

// Only use mock values if real env vars are not available
Object.keys(mockFirebaseConfig).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = mockFirebaseConfig[key];
  }
});

// Additional CI-specific configurations
jest.setTimeout(30000); // Longer timeout for CI

// Suppress specific console methods during tests in CI
global.console = {
  ...console,
  // Keep important logs but remove noisy ones
  log: jest.fn(),
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: jest.fn(),
};

// Mock specific modules that might be problematic in CI environments
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

beforeAll(() => {
  // Any setup needed before all tests in CI
});

afterAll(() => {
  // Any teardown needed after all tests in CI
}); 