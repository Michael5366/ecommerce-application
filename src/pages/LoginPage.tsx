import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authAPI';
import { LoginForm } from '../components/Auth/LoginForm';
import styles from './../components/Auth/LoginForm.module.css';

const LoginPage = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const data = await loginUser(values.email, values.password);
      localStorage.setItem('access_token', data.access_token);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <LoginForm onSubmit={handleSubmit} error={error} />
      <div className={styles.registerLink}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
