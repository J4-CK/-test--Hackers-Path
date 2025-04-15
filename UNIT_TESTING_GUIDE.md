# Unit Testing Guide for Hacker's Path

This guide explains how to use the unit testing setup in the Hacker's Path project. We use Jest for testing, along with React Testing Library for testing React components.

## Table of Contents

- [Testing Setup](#testing-setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
  - [Testing Utilities](#testing-utilities)
  - [Testing React Components](#testing-react-components)
  - [Testing Pages](#testing-pages)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)

## Testing Setup

The project uses the following testing tools:

- **Jest**: The core testing framework
- **React Testing Library**: For testing React components
- **Jest DOM**: Provides custom DOM element matchers for Jest
- **User Event**: Simulates user interactions for testing

The test configuration is defined in `jest.config.js`:

```javascript
// Key Jest configuration
testMatch: ['**/tests/unit/**/*.test.js'], // Pattern to find test files
collectCoverage: true,                     // Enable coverage collection
collectCoverageFrom: [                     // Files to include in coverage
  'utils/validation.js'                    // Currently only tracking this file
],
coverageDirectory: 'coverage',             // Where coverage reports are saved
coverageReporters: ['text', 'lcov']        // Coverage report formats
```

## Running Tests

You can run tests using npm scripts defined in `package.json`:

```bash
# Run all tests
npm test

# Run tests in watch mode (rerun when files change)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

## Writing Tests

Tests are organized in the `tests/unit` directory, mirroring the project structure:

```
tests/unit/
  ├── components/    # Component tests
  ├── pages/         # Page tests
  └── utils/         # Utility function tests
```

### Testing Utilities

Utility functions are typically pure functions that can be tested in isolation. Here's an example from `validation.test.js`:

```javascript
import { validateEmail, validatePassword } from '../../../utils/validation';

describe('Email Validation', () => {
  it('validates correct email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@example.co.uk')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(validateEmail('userexample.com')).toBe(false); // Missing @
    expect(validateEmail('')).toBe(false);                // Empty string
  });
});
```

Key concepts:
- `describe`: Groups related tests
- `it`: Defines a single test case
- `expect`: Makes assertions about values

### Testing React Components

Components are tested using React Testing Library. Here's an example from `Loading.test.js`:

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../../../components/Loading';

describe('Loading Component', () => {
  it('renders loading spinner and text', () => {
    render(<Loading />);
    
    // Check for loading container
    const loadingContainer = screen.getByText('Loading...').closest('.loading-container');
    expect(loadingContainer).toBeInTheDocument();
    
    // Check for spinner
    const spinner = loadingContainer.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
```

Key concepts:
- `render`: Renders a React component for testing
- `screen`: Provides methods to query the rendered output
- `getByText`, `querySelector`: Methods to find elements
- `toBeInTheDocument`: Jest DOM matcher to check if an element exists

### Testing Pages

Testing pages often requires mocking external dependencies like routers, API calls, etc. The project includes mock setups in `jest.setup.js`:

```javascript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock Supabase client
jest.mock('./config/supabaseClient', () => ({
  // ...mocked methods
}));

// Mock fetch API
global.fetch = jest.fn();
```

When testing pages, you can simulate user interactions with `@testing-library/user-event`:

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../pages/login';

test('handles form submission', async () => {
  const user = userEvent.setup();
  render(<LoginPage />);
  
  // Fill form fields
  await user.type(screen.getByLabelText(/email/i), 'user@example.com');
  await user.type(screen.getByLabelText(/password/i), 'Password123');
  
  // Submit form
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  // Assert results
  // ...
});
```

## Test Coverage

The project is set up to track test coverage with the following configuration:

```javascript
collectCoverage: true,
collectCoverageFrom: [
  'utils/validation.js'  // Currently only this file is tracked
],
```

To include more files in coverage tracking, modify the `collectCoverageFrom` array in `jest.config.js`:

```javascript
collectCoverageFrom: [
  'utils/**/*.js',
  'components/**/*.{js,jsx}',
  'pages/**/*.{js,jsx}',
  '!**/node_modules/**'  // Exclude node_modules
]
```

Coverage reports are generated in the `coverage` directory:
- Text summary in the console
- HTML reports in `coverage/lcov-report/index.html`

## Best Practices

1. **Test Behavior, Not Implementation**:
   - Focus on what components/functions do, not how they do it
   - Test from the user's perspective when possible

2. **Keep Tests Independent**:
   - Each test should run in isolation
   - Avoid dependencies between tests

3. **Use Appropriate Queries**:
   - Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`
   - Use `findBy` for async operations

4. **Mock External Dependencies**:
   - Mock API calls, third-party libraries, and browser APIs
   - Keep mocks minimal and focused on what's necessary

5. **Act Warnings**:
   - Wrap React state updates with `act()`
   - Use `userEvent` instead of direct DOM events

6. **Test Structure**:
   - Arrange: Set up the test environment
   - Act: Perform the action being tested
   - Assert: Verify the expected outcome

7. **Test Coverage**:
   - Aim for high coverage but prioritize test quality over quantity
   - Test edge cases and error scenarios

By following these guidelines, you'll maintain a robust test suite that helps ensure the reliability of the Hacker's Path application. 