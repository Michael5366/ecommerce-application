import { Category } from '../../types/productTypes';
import { CategoryList } from './CategoryList';
import styles from './CategoriesModal.module.css';
import { useTranslation } from 'react-i18next';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

export const CategoriesModal = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoriesModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('Categories')}</h2>
          <button className={styles.modalCloseButton} onClick={onClose} aria-label={t('Close')}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={(id) => {
              setSelectedCategory(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
