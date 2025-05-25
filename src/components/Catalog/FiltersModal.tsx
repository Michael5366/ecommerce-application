import { FC } from 'react';
import { PriceFilter } from './PriceFilter';
import { ColorFilter } from './ColorFilter';
import { SizeFilter } from './SizeFilter';
import styles from './FiltersModal.module.css';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  handlePriceChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableColors: string[];
  availableSizes: string[];
  filters: {
    color: string;
    size: string;
  };
  setFilters: (filters: { color: string; size: string }) => void;
  resetFilters: () => void;
}

export const FiltersModal: FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  priceRange,
  handlePriceChange,
  availableColors,
  availableSizes,
  filters,
  setFilters,
  resetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Filters</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <PriceFilter priceRange={priceRange} handlePriceChange={handlePriceChange} />

          {availableColors.length > 0 && (
            <ColorFilter
              availableColors={availableColors}
              selectedColor={filters.color}
              onSelectColor={(color) => setFilters({ ...filters, color })}
            />
          )}

          {availableSizes.length > 0 && (
            <SizeFilter
              availableSizes={availableSizes}
              selectedSize={filters.size}
              onSelectSize={(size) => setFilters({ ...filters, size })}
            />
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={resetFilters} className={styles.modalSecondaryButton}>
            Reset
          </button>
          <button onClick={onClose} className={styles.modalPrimaryButton}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
