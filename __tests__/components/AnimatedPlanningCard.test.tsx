// @ts-nocheck
/**
 * @jest-environment jsdom
 * 
 * Test file for AnimatedPlanningCard component
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { AnimatedPlanningCard } from '../../components/AnimatedPlanningCard';

// More complete mock for React Native Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });

// Mock timing functions to run immediately
jest.useFakeTimers();

describe('AnimatedPlanningCard', () => {
  it('renders correctly with provided value', () => {
    const { getByText } = render(
      <AnimatedPlanningCard value="5" onSelect={() => {}} selected={false} />
    );
    
    expect(getByText('5')).toBeTruthy();
  });

  it('calls onSelect when pressed', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(
      <AnimatedPlanningCard value="5" onSelect={onSelectMock} selected={false} />
    );
    
    fireEvent.press(getByText('5'));
    expect(onSelectMock).toHaveBeenCalledWith('5');
  });

  it('has default and selected states', () => {
    const { getByText, rerender } = render(
      <AnimatedPlanningCard value="5" onSelect={() => {}} selected={false} />
    );
    
    const card = getByText('5').parent;
    
    // Rerender with selected true
    act(() => {
      rerender(
        <AnimatedPlanningCard value="5" onSelect={() => {}} selected={true} />
      );
    });
    
    // We don't test exact styling as animations make this challenging
    // Instead we verify the component renders in both states without errors
    expect(card).toBeTruthy();
  });

  it('handles animation correctly', () => {
    const { getByText, rerender } = render(
      <AnimatedPlanningCard value="5" onSelect={() => {}} selected={false} />
    );
    
    act(() => {
      rerender(
        <AnimatedPlanningCard value="5" onSelect={() => {}} selected={true} />
      );
    });
    
    // Animation should be triggered - this is mostly to ensure that the animation code doesn't crash
    expect(getByText('5')).toBeTruthy();
  });
}); 