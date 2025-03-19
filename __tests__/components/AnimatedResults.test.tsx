// @ts-nocheck
/**
 * @jest-environment jsdom
 * 
 * Test file for AnimatedResults component
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { AnimatedResults } from '../../components/AnimatedResults';

// Mock Animated API
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });

// Mock timing functions to run immediately
jest.useFakeTimers();

// Mock Platform.OS
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn(obj => obj.web)
}), { virtual: true });

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'session.average': 'Average',
        'session.mostCommon': 'Most common',
        'session.totalVotes': 'Total votes'
      };
      return translations[key] || key;
    }
  })
}));

describe('AnimatedResults', () => {
  const mockVoteResults = [
    { value: '3', count: 1, percentage: 20 },
    { value: '5', count: 2, percentage: 40 },
    { value: '8', count: 2, percentage: 40 }
  ];
  
  it('renders summary values correctly', () => {
    const { getByText } = render(
      <AnimatedResults 
        voteResults={mockVoteResults}
        average={5.4}
        mostFrequent="5,8"
        totalVotes={5}
      />
    );
    
    // Check summary text
    expect(getByText('Average: 5.4')).toBeTruthy();
    expect(getByText('Most frequent: 5,8')).toBeTruthy();
    expect(getByText('Total votes: 5')).toBeTruthy();
  });
  
  it('renders all result bars with correct percentages', () => {
    const { getAllByText } = render(
      <AnimatedResults 
        voteResults={mockVoteResults}
        average={5.4}
        mostFrequent="5,8"
        totalVotes={5}
      />
    );
    
    // Check for the bar values - Note: "5" appears in the bar AND in the "Most frequent: 5,8" text
    expect(getAllByText('3')).toHaveLength(1);
    expect(getAllByText('5')).toHaveLength(1); // Only once in bar since we're not including "Most frequent: 5,8" text
    expect(getAllByText('8')).toHaveLength(1);
    
    // Check for count and percentage text
    expect(getAllByText('2 (40%)')).toHaveLength(2); // For both "5" and "8" values
    expect(getAllByText('1 (20%)')).toHaveLength(1); // For "3" value
  });
  
  it('handles empty results gracefully', () => {
    const { queryByText } = render(
      <AnimatedResults 
        voteResults={[]}
        average={0}
        mostFrequent=""
        totalVotes={0}
      />
    );
    
    // There should be no result bars
    expect(queryByText('No votes yet')).toBeTruthy();
  });
}); 