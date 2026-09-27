export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(value.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export interface FieldErrors {
  [key: string]: string | undefined;
}

export function validateLoginForm(values: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!isNonEmpty(values.email)) errors.email = 'Email is required';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address';

  if (!isNonEmpty(values.password)) errors.password = 'Password is required';
  else if (!minLength(values.password, 6)) errors.password = 'Password must be at least 6 characters';

  return errors;
}

export function validateRegisterForm(values: {
  fullName: string;
  email: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!isNonEmpty(values.fullName)) errors.fullName = 'Full name is required';
  if (!isNonEmpty(values.email)) errors.email = 'Email is required';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address';
  if (!isNonEmpty(values.password)) errors.password = 'Password is required';
  else if (!minLength(values.password, 6)) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function validateWorkerForm(values: {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  skills: string;
  experience: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!isNonEmpty(values.fullName)) errors.fullName = 'Full name is required';
  if (!isNonEmpty(values.email)) errors.email = 'Email is required';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address';
  if (!isNonEmpty(values.phone)) errors.phone = 'Phone number is required';
  else if (!isValidPhone(values.phone)) errors.phone = 'Enter a valid phone number';
  if (!isNonEmpty(values.dateOfBirth)) errors.dateOfBirth = 'Date of birth is required';
  if (!isNonEmpty(values.gender)) errors.gender = 'Select a gender';
  if (!isNonEmpty(values.location)) errors.location = 'Location is required';
  if (!isNonEmpty(values.skills)) errors.skills = 'List at least one skill';
  if (!isNonEmpty(values.experience)) errors.experience = 'Experience is required';
  return errors;
}
