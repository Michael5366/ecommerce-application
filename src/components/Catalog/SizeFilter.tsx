import { FC } from 'react';
import styles from './SizeFilter.module.css';

interface SizeFilterProps {
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export const SizeFilter: FC<SizeFilterProps> = ({ availableSizes, selectedSize, onSelectSize }) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>Size</label>
      <div className={styles.sizeFilter}>
        {availableSizes.map((size) => (
          <button
            key={size}
            className={`${styles.sizeOption} ${selectedSize === size ? styles.selected : ''}`}
            onClick={() => onSelectSize(selectedSize === size ? '' : size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
