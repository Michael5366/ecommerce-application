import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CommerceToolsAuthError, loginUser } from '../services/Auth/authAPI';
import { LoginForm } from '../components/Auth/LoginForm';
import { Loader } from '../components/UI/Loader';
import SpaIcon from '@mui/icons-material/Spa';
import styles from './../components/Auth/LoginForm.module.css';
import { Path } from '../types/paths.ts';
import { useAuth } from '../context/context.tsx';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [formError, setFormError] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    } else {
      setIsCheckingAuth(false);
    }
  }, [token, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setFormError('');
      setIsSubmitting(true);

      const { auth } = await loginUser(values.email, values.password);
      setToken(auth.access_token);
      navigate(Path.MAIN, { replace: true });
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
        Don&apos;t have an account?{' '}
        <Link
          to={Path.REGISTRATION}
          onClick={(e) => {
            e.preventDefault();
            navigate(Path.REGISTRATION, { state: { from: location.pathname } });
          }}
        >
          Register
        </Link>
      </div>
      <div className={styles.plantDecoration + ' ' + styles.plantBottom}>
        <SpaIcon fontSize="inherit" />
      </div>
    </div>
  );
};

export default LoginPage;
