import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleAllProductsClick = () => {
    setSelectedCategory('');
    navigate('/catalog');
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const categorySlug = category.name?.en?.toLowerCase().replace(/\s+/g, '-') || '';
      setSelectedCategory(categoryId);
      navigate(`/catalog/${categorySlug}`);
    }
  };

  return (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>Categories</h3>
      <ul className={styles.categoryList}>
        <li
          className={`${styles.categoryItem} ${!selectedCategory ? styles.activeCategory : ''}`}
          onClick={handleAllProductsClick}
        >
          <span className={styles.categoryName}>All products</span>
          {!selectedCategory && <span className={styles.activeIndicator}></span>}
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`${styles.categoryItem} ${
              selectedCategory === category.id ? styles.activeCategory : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className={styles.categoryName}>{category.name?.en || category.id}</span>
            {selectedCategory === category.id && <span className={styles.activeIndicator}></span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
