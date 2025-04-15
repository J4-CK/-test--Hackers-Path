/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {{ valid: boolean, message: string }} - Validation result with message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { 
      valid: false, 
      message: 'Password must be at least 8 characters long' 
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one number' 
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }
  
  return { valid: true, message: 'Password is strong' };
}; 