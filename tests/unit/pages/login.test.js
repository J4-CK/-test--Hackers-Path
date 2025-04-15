import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../pages/login';

// Mock fetch function
global.fetch = jest.fn();

describe('Login Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    fetch.mockClear();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    // Check for key elements
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    render(<LoginPage />);
    const user = userEvent.setup();
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data', async () => {
    // Mock successful login response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { id: '123', email: 'test@example.com' } }),
    });

    render(<LoginPage />);
    const user = userEvent.setup();
    
    // Fill out form
    await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that fetch was called with the right data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
    });
  });

  it('displays error message on login failure', async () => {
    // Mock failed login response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    });

    render(<LoginPage />);
    const user = userEvent.setup();
    
    // Fill out form
    await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrongpassword');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
}); 