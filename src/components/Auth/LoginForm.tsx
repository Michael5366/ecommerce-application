import { useState } from 'react';
import { useFormik } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { loginValidation } from '../../utils/loginValidation';
import styles from './LoginForm.module.css';

interface LoginFormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setErrors({});
        await onSubmit(values);
      } catch (error: unknown) {
        handleApiError(error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleApiError = (error: unknown) => {
    if (typeof error === 'object' && error !== null) {
      const apiError = error as { code?: string; message?: string; field?: string };

      const newErrors: FormErrors = {};

      if (apiError.code === 'invalid_grant') {
        if (apiError.field === 'email') {
          newErrors.email = 'Email not found. Please check or register.';
        } else if (apiError.field === 'password') {
          newErrors.password = 'Incorrect password. Please try again.';
        } else {
          newErrors.form = 'Invalid email or password combination.';
        }
      } else if (apiError.message) {
        newErrors.form = apiError.message;
      } else {
        newErrors.form = 'Login failed. Please try again later.';
      }

      setErrors(newErrors);
    } else {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: undefined }));
    }
  };

  const getInputClass = (fieldName: keyof LoginFormValues) => {
    const hasError = (formik.touched[fieldName] && formik.errors[fieldName]) || errors[fieldName];
    return hasError ? `${styles.input} ${styles.errorInput}` : styles.input;
  };

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          onChange={handleInputChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className={getInputClass('email')}
          aria-invalid={!!(formik.errors.email || errors.email)}
          aria-describedby="email-error"
        />
        {formik.touched.email && formik.errors.email && (
          <div id="email-error" className={styles.error} role="alert">
            <ErrorOutlineIcon className={styles.errorIcon} />
            {formik.errors.email}
          </div>
        )}
        {errors.email && (
          <div id="email-error" className={styles.error} role="alert">
            <ErrorOutlineIcon className={styles.errorIcon} />
            {errors.email}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordInputContainer}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={getInputClass('password')}
            aria-invalid={!!(formik.errors.password || errors.password)}
            aria-describedby="password-error"
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div id="password-error" className={styles.error} role="alert">
            <ErrorOutlineIcon className={styles.errorIcon} />
            {formik.errors.password}
          </div>
        )}
        {errors.password && (
          <div id="password-error" className={styles.error} role="alert">
            <ErrorOutlineIcon className={styles.errorIcon} />
            {errors.password}
          </div>
        )}
      </div>

      {errors.form && (
        <div className={styles.authError} role="alert">
          <ErrorOutlineIcon className={styles.errorIcon} />
          {errors.form}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!formik.isValid || formik.isSubmitting}
        aria-busy={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <>
            <CircularProgress size={20} className={styles.spinner} />
            <span className={styles.buttonText}>Processing...</span>
          </>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};
