import { useEffect, useState } from 'react';
import { passwordSchema } from '../../utils/validatePassword';
import { changeUserPassword } from '../../services/ClientInfApi/changePassword';
import styles from './ModalPersonalData.module.css';
import { loginUser } from '../../services/Auth/authAPI';
import { useAuth } from '../../context/context';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
  
}

export default function EditPasswordModal({ isOpen, onClose, id, version}: Props) {
  const [newPassword, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const { setToken } = useAuth();

    useEffect(() => {
    if (isOpen) {
      setPasswordChanged(false);
      setCurrentPassword('');
      setPassword('');
      setSubmitted(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    

    const result = passwordSchema.safeParse({ currentPassword, newPassword });

    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      setError(null);
      try {
         const response = await changeUserPassword({ currentPassword, newPassword, id, version });
         console.log('Ответ от сервера:', response);
         localStorage.setItem('newPassword', newPassword);
         const email = sessionStorage.getItem('ct_customer_email');
        if (email) {
       const { auth } = await loginUser(email, newPassword);
       sessionStorage.setItem('auth_token', auth.access_token);
       setToken(auth.access_token);
       localStorage.removeItem('newPassword');
        }

        setPasswordChanged(true);
        setCurrentPassword('');
        setPassword('');
      } catch (err) {
        console.error(err);
        setError('Failed to change password. Please try again.');
      }
    }
  };
  const handlecurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    if (submitted) setError(null);
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (submitted) setError(null);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {!passwordChanged ? (
          <>
            <h2 className={styles.title}>Change Password</h2>
            <form onSubmit={handleSubmitPassword}>
              <input
                className={styles.input}
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={handlecurrentPasswordChange}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}

              <button type="button" className={styles.button} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.button}>
                Submit
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Password changed</h2>
            <p>You can continue...</p>
            <button className={styles.button} onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
