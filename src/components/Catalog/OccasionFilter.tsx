import { FC } from 'react';
import styles from './OccasionFilter.module.css';

interface OccasionFilterProps {
  availableOccasions: string[];
  selectedOccasion: string;
  onSelectOccasion: (occasion: string) => void;
}

export const OccasionFilter: FC<OccasionFilterProps> = ({
  availableOccasions,
  selectedOccasion,
  onSelectOccasion,
}) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>Occasion</label>
      <div className={styles.occasionFilter}>
        {availableOccasions.map((occasion) => (
          <button
            key={occasion}
            className={`${styles.occasionOption} ${selectedOccasion === occasion ? styles.selected : ''}`}
            onClick={() => onSelectOccasion(selectedOccasion === occasion ? '' : occasion)}
          >
            {occasion}
          </button>
        ))}
      </div>
    </div>
  );
};
