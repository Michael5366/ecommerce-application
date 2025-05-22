import * as Yup from 'yup';

export const loginValidation = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .test('no-spaces', 'Email must not contain spaces', (value) => {
      return value ? !/\s/.test(value) : true;
    })
    .email('Invalid email format')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must contain a domain name'),
  password: Yup.string()
    .required('Password is required')
    .test('no-spaces', 'Password must not contain spaces', (value) => {
      return value ? !/\s/.test(value) : true;
    })
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one digit'),
  // .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
});
