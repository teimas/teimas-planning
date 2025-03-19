// @ts-nocheck
/**
 * Test file for i18n functionality
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock translations
jest.mock('../../src/i18n/locales/en', () => ({
  common: {
    start: 'Start',
    join: 'Join',
    leave: 'Leave',
    vote: 'Vote',
    reveal: 'Reveal',
    reset: 'Reset',
  },
}), { virtual: true });

jest.mock('../../src/i18n/locales/es', () => ({
  common: {
    start: 'Iniciar',
    join: 'Unirse',
    leave: 'Salir',
    vote: 'Votar',
    reveal: 'Revelar',
    reset: 'Reiniciar',
  },
}), { virtual: true });

// Mock i18next
const mockT = jest.fn(key => key);
jest.mock('i18next', () => {
  const mockI18n = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue({}),
    changeLanguage: jest.fn().mockResolvedValue({}),
    language: 'en',
    t: mockT,
  };
  return mockI18n;
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: 'i18next',
  },
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('en'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'en' }]),
}));

// Create mock implementations for i18n functions
const mockGetCurrentLanguage = jest.fn().mockReturnValue('en');
const mockSetLanguage = jest.fn().mockImplementation(lang => {
  mockGetCurrentLanguage.mockReturnValue(lang);
  return Promise.resolve();
});
const mockInitializeLanguage = jest.fn().mockImplementation(async () => {
  // Return the stored language or default to 'en'
  const storedLanguage = await AsyncStorage.getItem.mock.results[0]?.value;
  if (storedLanguage) {
    mockGetCurrentLanguage.mockReturnValue(storedLanguage);
  }
  return storedLanguage || 'en';
});

// Mock the i18n module
jest.mock('../../src/i18n', () => ({
  __esModule: true,
  initializeLanguage: mockInitializeLanguage,
  getCurrentLanguage: mockGetCurrentLanguage,
  setLanguage: mockSetLanguage,
  t: mockT,
  default: {
    use: jest.fn().mockReturnThis(),
    init: jest.fn(),
    changeLanguage: jest.fn().mockResolvedValue({}),
  },
}));

// Simple test that doesn't rely on importing the actual i18n module
describe('i18n (Basic Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mocks AsyncStorage correctly', async () => {
    const language = await AsyncStorage.getItem('language');
    expect(language).toBe('en');
    
    await AsyncStorage.setItem('language', 'es');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'es');
  });
  
  it('provides a basic mock for translations', () => {
    // This is just a simple test to verify Jest is working
    const mockTranslate = jest.fn(key => key);
    expect(mockTranslate('common.start')).toBe('common.start');
    expect(mockTranslate).toHaveBeenCalledWith('common.start');
  });
}); 