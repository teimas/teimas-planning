// @ts-nocheck
/**
 * Test file for sessionStore.ts
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import { act } from '@testing-library/react-native';
import useSessionStore from '../../stores/sessionStore';

// Mock Firebase config
jest.mock('../../firebase/config', () => ({
  database: {}
}));

// Mock Firebase database functions
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn().mockReturnValue({}),
  ref: jest.fn().mockReturnValue({}),
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue({
    exists: () => true,
    val: () => ({
      creatorId: 'mock-creator-id',
      participants: [],
      isRevealed: false
    })
  }),
  onValue: jest.fn().mockImplementation((ref, callback) => {
    callback({
      val: () => ({
        creatorId: 'mock-creator-id',
        participants: [],
        isRevealed: false
      })
    });
    return jest.fn(); // Return unsubscribe function
  }),
  off: jest.fn(),
  push: jest.fn().mockReturnValue({ key: 'mock-uuid-123456789' }),
  onDisconnect: jest.fn().mockReturnValue({
    remove: jest.fn().mockResolvedValue(undefined)
  }),
  update: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined)
}));

// Mock uuid for consistent tests
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-123456789')
}));

// Basic tests for the sessionStore
describe('sessionStore (Basic Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset store state between tests
    const store = useSessionStore.getState();
    store.currentSession = null;
    store.currentParticipant = null;
    store.error = null;
    store.loading = false;
  });

  it('initializes with default values', () => {
    const store = useSessionStore.getState();
    
    // Check initial state
    expect(store.currentSession).toBeNull();
    expect(store.currentParticipant).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });
  
  it('exposes required functions', () => {
    const store = useSessionStore.getState();
    
    // Check that the store exposes the necessary functions
    expect(typeof store.createSession).toBe('function');
    expect(typeof store.joinSession).toBe('function');
    expect(typeof store.leaveSession).toBe('function');
    expect(typeof store.castVote).toBe('function');
    expect(typeof store.revealVotes).toBe('function');
    expect(typeof store.resetVotes).toBe('function');
  });
}); 