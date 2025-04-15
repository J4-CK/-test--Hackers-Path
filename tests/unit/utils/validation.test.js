import { validateEmail, validatePassword } from '../../../utils/validation';

describe('Email Validation', () => {
  it('validates correct email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@example.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(validateEmail('userexample.com')).toBe(false); // Missing @
    expect(validateEmail('user@')).toBe(false); // Missing domain
    expect(validateEmail('@example.com')).toBe(false); // Missing username
    expect(validateEmail('user@example')).toBe(false); // Missing top-level domain
    expect(validateEmail('user@.com')).toBe(false); // Missing domain name
    expect(validateEmail('')).toBe(false); // Empty string
    expect(validateEmail(null)).toBe(false); // Null
    expect(validateEmail(undefined)).toBe(false); // Undefined
  });
});

describe('Password Validation', () => {
  it('accepts strong passwords', () => {
    const result = validatePassword('Password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Password is strong');
  });

  it('rejects passwords that are too short', () => {
    const result = validatePassword('Pass1');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must be at least 8 characters long');
  });

  it('rejects passwords without numbers', () => {
    const result = validatePassword('PasswordOnly');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must contain at least one number');
  });

  it('rejects passwords without uppercase letters', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must contain at least one uppercase letter');
  });

  it('handles edge cases', () => {
    // Empty string
    expect(validatePassword('').valid).toBe(false);
    
    // Null
    expect(validatePassword(null).valid).toBe(false);
    
    // Undefined would throw an error when checking length, 
    // so we need to handle that in our validate function
    expect(validatePassword(undefined).valid).toBe(false);
  });
}); 