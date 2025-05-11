import { useFormik } from 'formik';
import { loginValidation } from '../../utils/loginValidation';
import styles from './LoginForm.module.css';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  error?: string;
}

export const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidation,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && <div className={styles.error}>{formik.errors.password}</div>}
      </div>

      {error && <div className={styles.authError}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Login
      </button>
    </form>
  );
};
