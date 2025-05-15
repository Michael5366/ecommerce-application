import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CommerceToolsAuthError, loginUser, isAuthenticated } from '../services/authAPI';
import { LoginForm } from '../components/Auth/LoginForm';
import { Loader } from '../components/UI/Loader';
import styles from './../components/Auth/LoginForm.module.css';

const LoginPage = () => {
  const [formError, setFormError] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
      const data = await loginUser(values.email, values.password);

      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      localStorage.setItem('token_expires_in', String(Date.now() + data.expires_in * 1000));

      navigate('/', { replace: true });
    } catch (err: unknown) {
      let errorMessage = 'Invalid email or password';

      if (err instanceof CommerceToolsAuthError) {
        switch (err.code) {
          case 'invalid_grant':
            errorMessage = 'Invalid email or password';
            break;
          case 'invalid_client':
            errorMessage = 'Authentication configuration error';
            break;
          default:
            errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setFormError(errorMessage);
    }
  };

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {formError && <div className={styles.authError}>{formError}</div>}
      <LoginForm onSubmit={handleSubmit} />
      <div className={styles.registerLink}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
