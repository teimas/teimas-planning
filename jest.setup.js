// Root level jest.setup.js
// Global Jest setup that applies to all tests

// Set timezone to ensure consistent date handling
process.env.TZ = 'UTC';

// Configure global mocks
global.fetch = jest.fn();

// Silence React Native warnings during tests
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
}));

// Any global setup needed for all tests
beforeAll(() => {
  // Setup code that runs before all tests
});

// Global teardown
afterAll(() => {
  // Cleanup code that runs after all tests
}); 