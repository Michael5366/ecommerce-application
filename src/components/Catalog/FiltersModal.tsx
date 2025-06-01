import { FC } from 'react';
import { ProductFilters } from '../../types/productTypes';
import { PriceFilter } from './PriceFilter';
import { ColorFilter } from './ColorFilter';
import { OccasionFilter } from './OccasionFilter';
import { FlowerTypeFilter } from './FlowerTypeFilter';
import styles from './FiltersModal.module.css';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  handlePriceChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableColors: string[];
  availableOccasions: string[];
  availableFlowerTypes: string[];
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
}

export const FiltersModal: FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  priceRange,
  handlePriceChange,
  availableColors,
  availableOccasions,
  availableFlowerTypes,
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

          {availableOccasions.length > 0 && (
            <OccasionFilter
              availableOccasions={availableOccasions}
              selectedOccasion={filters.occasion}
              onSelectOccasion={(occasion) => setFilters({ ...filters, occasion })}
            />
          )}

          {availableFlowerTypes.length > 0 && (
            <FlowerTypeFilter
              availableFlowerTypes={availableFlowerTypes}
              selectedFlowerType={filters.flowerType}
              onSelectFlowerType={(flowerType) => setFilters({ ...filters, flowerType })}
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
