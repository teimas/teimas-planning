# Planning Poker Tests

This folder contains unit tests for the Planning Poker application. The tests are organized by category:

- `components/`: Tests for React components
- `stores/`: Tests for state management
- `i18n/`: Tests for internationalization

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- __tests__/components/AnimatedPlanningCard.test.tsx
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Test Structure

Each test file follows the same structure:

1. TypeScript errors are ignored (`// @ts-nocheck`) to allow for easier mocking
2. Required modules are imported and mocked where necessary
3. Tests are organized using `describe` and `test` blocks
4. Each test has clear assertions that test specific functionality

## Mocking Strategy

- **Firebase**: Firebase functions are mocked to prevent actual database calls
- **Animations**: React Native animations are mocked to prevent test errors
- **AsyncStorage**: Mocked to test language persistence without actual storage
- **i18n**: Language functions are mocked to return predictable translations
- **Platform**: Platform-specific code is mocked to simulate web or native environments

## Example Test

```javascript
// @ts-nocheck
/**
 * @jest-environment jsdom
 * 
 * Test file for Component
 * TypeScript errors are ignored in test files to allow for easier mocking and testing
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Component } from '../../components/Component';

describe('Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Expected Text')).toBeDefined();
  });
});
```

## Troubleshooting Tests

### Common Issues

- **Animation errors**: Make sure animations are mocked properly
- **Firebase errors**: Ensure all Firebase functions are properly mocked
- **Timing issues**: Use `async/await` and `act()` for asynchronous tests
- **Rendering issues**: Check that all required providers are wrapped around components

### Debug Mode

To run tests in debug mode:

```bash
npm test -- --debug
```

This will allow for more detailed output to help diagnose issues. 