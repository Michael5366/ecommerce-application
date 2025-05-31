import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { passwordSchema } from '../../utils/validatePassword';
import { changeUserPassword } from '../../services/ClientInfApi/changePassword';
import styles from './ModalPersonalData.module.css';
import { Path } from '../../types/paths';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
  logout: () => void
}

export default function EditPasswordModal({ isOpen, onClose, id, version, logout }: Props) {
  const [newPassword, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const navigate = useNavigate();

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
      await changeUserPassword({ currentPassword, newPassword, id, version });
      setPasswordChanged(true);
      setCurrentPassword('');
      setPassword('');
      logout();
      navigate(Path.MAIN, { state: { message: 'Password changed. Please log in again.' } });
    } catch (err) {
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
            <button type="submit" className={styles.button}>Submit</button>
          </form>
        </>
      ) : (
        <>
          <h2 className={styles.title}>Password changed</h2>
          <p>Please log in again with your new password.</p>
          <button className={styles.button} onClick={onClose}>
            Close
          </button>
        </>
      )}
      </div>
    </div>
  );
}
