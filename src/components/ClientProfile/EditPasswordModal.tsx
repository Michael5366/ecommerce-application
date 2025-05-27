import { useState } from 'react';
import { passwordSchema } from '../../utils/validatePassword';
import { changeUserPassword } from '../../services/ClientInfApi/changePassword';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  version: number;
}

export default function EditPasswordModal({ isOpen, onClose, id, version }: Props) {
  const [newPassword, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;
  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const result = passwordSchema.safeParse({ currentPassword, newPassword });

    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      setError(null);
      console.log('Отправляем пароль:', newPassword, currentPassword);
      changeUserPassword({ currentPassword, newPassword, id, version });
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
    <div className="modal">
      <div className="modal-content">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmitPassword}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={handlecurrentPasswordChange}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
