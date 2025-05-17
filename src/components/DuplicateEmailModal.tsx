import '../styles/cssRegistration.css';

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
        <h2>Пользователь с таким email уже существует</h2>
        <p>Пожалуйста, используйте другую почту или войдите на сайт.</p>
        <div className="buttons">
          <button onClick={onClose} className="button">
            Использовать другую почту
          </button>
          <button onClick={onLoginRedirect} className="buttonPrimary">
            Войти на сайт
          </button>
        </div>
      </div>
    </div>
  );
}
