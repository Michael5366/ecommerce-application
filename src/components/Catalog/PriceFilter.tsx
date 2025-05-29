import { FC } from 'react';
import styles from './PriceFilter.module.css';

interface PriceFilterProps {
  priceRange: [number, number];
  handlePriceChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PriceFilter: FC<PriceFilterProps> = ({ priceRange, handlePriceChange }) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>
        Price range:
        <span className={styles.priceRangeValue}>
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </label>
      <div className={styles.rangeSliderContainer}>
        <div className={styles.rangeSlider}>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[0]}
            onChange={handlePriceChange(0)}
            className={styles.rangeInput}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={handlePriceChange(1)}
            className={styles.rangeInput}
          />
        </div>
      </div>
    </div>
  );
};
