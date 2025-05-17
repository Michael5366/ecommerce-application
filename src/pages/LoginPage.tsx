import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CommerceToolsAuthError,
  loginUser,
  isAuthenticated,
  storeAuthData,
} from '../services/authAPI';
import { LoginForm } from '../components/Auth/LoginForm';
import { Loader } from '../components/UI/Loader';
import styles from './../components/Auth/LoginForm.module.css';

const LoginPage = () => {
  const [formError, setFormError] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setFormError('');
      setIsSubmitting(true);

      const { auth, customer } = await loginUser(values.email, values.password);
      storeAuthData(auth, customer);

      navigate('/', { replace: true });
    } catch (err: unknown) {
      let errorMessage = 'Invalid email or password';

      if (err instanceof CommerceToolsAuthError) {
        switch (err.code) {
          case 'invalid_grant':
            errorMessage = err.details || 'Invalid email or password';
            break;
          case 'InvalidCredentials':
            errorMessage = 'The email or password is incorrect';
            break;
          case 'AccountLocked':
            errorMessage = 'Your account has been locked due to too many failed attempts';
            break;
          case 'invalid_client':
            errorMessage = 'Authentication configuration error';
            break;
          default:
            errorMessage = err.message || 'Authentication failed';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {formError && (
        <div className={styles.authError} role="alert">
          {formError}
        </div>
      )}
      <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <div className={styles.registerLink}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
      <div className={styles.forgotPasswordLink}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};

export default LoginPage;
