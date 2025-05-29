import { FC } from 'react';
import styles from './ColorFilter.module.css';

interface ColorFilterProps {
  availableColors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorFilter: FC<ColorFilterProps> = ({
  availableColors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>Color:</label>
      <div className={styles.colorFilter}>
        {availableColors.map((color) => (
          <button
            key={color}
            className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
            onClick={() => onSelectColor(selectedColor === color ? '' : color)}
            style={{ backgroundColor: color.toLowerCase() }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
