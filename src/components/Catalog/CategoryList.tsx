import { FC } from 'react';
import { Category } from '../../types/productTypes';
import styles from './CategoryList.module.css';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

export const CategoryList: FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>Categories</h3>
      <ul className={styles.categoryList}>
        <li
          className={`${styles.categoryItem} ${!selectedCategory ? styles.activeCategory : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          <span className={styles.categoryName}>All products</span>
          {!selectedCategory && <span className={styles.activeIndicator}></span>}
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={styles.categoryName}>{category.name?.en || category.id}</span>
            {selectedCategory === category.id && <span className={styles.activeIndicator}></span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
