import { FC } from 'react';
import { Category, Product } from '../../types/productTypes';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  categories: Category[];
}

export const ProductGrid: FC<ProductGridProps> = ({ products, searchQuery, categories }) => {
  if (products.length === 0) {
    return (
      <div className={styles.noResults}>
        <h3>No products found</h3>
        <p>Try changing your search parameters or filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          searchQuery={searchQuery}
          categories={categories}
        />
      ))}
    </div>
  );
};
