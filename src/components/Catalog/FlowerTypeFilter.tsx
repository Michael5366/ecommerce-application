import { FC } from 'react';
import styles from './FlowerTypeFilter.module.css';

interface FlowerTypeFilterProps {
  availableFlowerTypes: string[];
  selectedFlowerType: string;
  onSelectFlowerType: (flowerType: string) => void;
}

export const FlowerTypeFilter: FC<FlowerTypeFilterProps> = ({
  availableFlowerTypes,
  selectedFlowerType,
  onSelectFlowerType,
}) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>Sun addiction:</label>
      <div className={styles.flowerTypeFilter}>
        {availableFlowerTypes.map((flowerType) => (
          <button
            key={flowerType}
            className={`${styles.flowerTypeOption} ${selectedFlowerType === flowerType ? styles.selected : ''}`}
            onClick={() => onSelectFlowerType(selectedFlowerType === flowerType ? '' : flowerType)}
          >
            {flowerType}
          </button>
        ))}
      </div>
    </div>
  );
};
