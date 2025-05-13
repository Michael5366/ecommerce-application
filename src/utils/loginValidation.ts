import * as Yup from 'yup';

export const loginValidation = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .trim('Email must not contain leading or trailing whitespace')
    .strict(true)
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must contain a domain name'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .trim('Password must not contain leading or trailing whitespace')
    .strict(true)
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one digit')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
});
