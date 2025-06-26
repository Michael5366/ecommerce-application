import './cssRegistration.css';

type DuplicateEmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginRedirect: () => void;
};

export default function DuplicateEmailModal({
  isOpen,
  onClose,
  onLoginRedirect,
}: DuplicateEmailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>A user with this email already exists</h2>
        <p>Please use a different email or log in to the website.</p>
        <div className="buttons">
          <button onClick={onClose} className="button">
            Use a different email
          </button>
          <button onClick={onLoginRedirect} className="buttonPrimary">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
