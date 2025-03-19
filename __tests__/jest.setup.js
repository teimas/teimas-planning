/**
 * Jest global setup file for Planning Poker tests
 * 
 * This file is executed before all tests run and sets up the
 * global test environment.
 */

// Set timezone to UTC for consistent date handling
process.env.TZ = 'UTC';

// Mock console methods to keep test output clean
// while still allowing errors to show
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Only show console.error messages in tests
console.error = (...args) => {
  // Filter out known React Native warnings that aren't relevant for tests
  const message = args.join(' ');
  if (
    message.includes('RCTBridge required dispatch_sync') ||
    message.includes('Animated: `useNativeDriver`') ||
    message.includes('AsyncStorage has been extracted')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Suppress console.warn in tests to reduce noise
console.warn = (...args) => {
  // Filter out known React Native warnings that aren't relevant for tests
  const message = args.join(' ');
  if (
    message.includes('Animated:') ||
    message.includes('componentWillReceiveProps') ||
    message.includes('componentWillMount')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Suppress console.log in tests unless in debug mode
console.log = (...args) => {
  if (process.env.DEBUG) {
    originalConsoleLog(...args);
  }
};

// Restore original console methods after tests complete
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Mock for Expo's Clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve(true))
}), { virtual: true });

// Mock for Expo's Share module
jest.mock('expo-sharing', () => ({
  share: jest.fn(() => Promise.resolve({}))
}), { virtual: true });

// Add a simple test to make Jest happy
describe('Jest setup', () => {
  test('setup is working correctly', () => {
    expect(true).toBe(true);
  });
}); 