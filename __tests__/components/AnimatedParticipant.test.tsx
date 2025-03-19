// @ts-nocheck
/**
 * @jest-environment jsdom
 * 
 * Test file for AnimatedParticipant component
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AnimatedParticipant } from '../../components/AnimatedParticipant';

// Mock Animated API
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });

// Mock timing functions to run immediately
jest.useFakeTimers();

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'session.youIndicator': ' (You)'
      };
      return translations[key] || key;
    }
  })
}));

describe('AnimatedParticipant', () => {
  const mockParticipant = {
    id: 'test123',
    name: 'Test User',
    vote: null,
    image: 'RG'
  };
  
  const mockImageSource = { uri: 'test-image-uri' };
  
  test('renders participant name correctly', () => {
    const { getByText } = render(
      <AnimatedParticipant 
        participant={mockParticipant} 
        imageSource={mockImageSource}
      />
    );
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(getByText('Test User')).toBeDefined();
  });
  
  test('renders current user indicator when isCurrentUser is true', () => {
    const { getByText } = render(
      <AnimatedParticipant 
        participant={mockParticipant} 
        imageSource={mockImageSource}
        isCurrentUser={true}
      />
    );
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(getByText('Test User (You)')).toBeDefined();
  });
  
  test('renders creator crown when isCreator is true', () => {
    const { getByText } = render(
      <AnimatedParticipant 
        participant={mockParticipant} 
        imageSource={mockImageSource}
        isCreator={true}
      />
    );
    
    act(() => {
      jest.runAllTimers();
    });
    
    // The crown emoji should be part of the text
    expect(getByText(/Test User.*👑/)).toBeDefined();
  });
  
  test('renders voted badge when hasVoted is true', () => {
    const { getByText } = render(
      <AnimatedParticipant 
        participant={mockParticipant} 
        imageSource={mockImageSource}
        hasVoted={true}
      />
    );
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(getByText('✓')).toBeDefined();
  });
  
  test('does not show name when showName is false', () => {
    const { queryByText } = render(
      <AnimatedParticipant 
        participant={mockParticipant} 
        imageSource={mockImageSource}
        showName={false}
      />
    );
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(queryByText('Test User')).toBeNull();
  });
}); 