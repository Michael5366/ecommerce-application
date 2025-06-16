import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, Product } from '../../types/productTypes';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  categories: Category[];
  cartItems?: string[];
  onAddToCart?: (productId: string) => Promise<void>;
}

export const ProductGrid: FC<ProductGridProps> = ({
  products,
  searchQuery,
  categories,
  cartItems = [],
  onAddToCart,
}) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className={styles.noResults}>
        <h3>{t('No products found')}</h3>
        <p>{t('Try changing your search parameters or filters.')}</p>
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
          isInCart={cartItems.includes(product.id)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
