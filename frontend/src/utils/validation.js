export const validateName = (name) => {
  if (!name || name.trim().length < 20) {
    return 'Name must be at least 20 characters';
  }
  if (name.trim().length > 60) {
    return 'Name must not exceed 60 characters';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validateAddress = (address, required = false) => {
  if (required && (!address || !address.trim())) {
    return 'Address is required';
  }
  if (address && address.length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return '';
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  return error.response?.data?.message || error.message || 'Something went wrong';
};
