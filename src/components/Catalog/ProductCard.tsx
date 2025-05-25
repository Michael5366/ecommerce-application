import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductPriceInfo } from '../../types/productTypes';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  searchQuery: string;
}

export const ProductCard: FC<ProductCardProps> = ({ product, searchQuery }) => {
  const navigate = useNavigate();
  const productName = product.masterData?.current?.name?.en || product.id;
  const productDescription = product.masterData?.current?.description?.en;
  const mainImage = product.masterData?.current?.masterVariant?.images?.[0]?.url;

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className={styles.highlightedText}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getProductPrice = (product: Product): ProductPriceInfo | null => {
    try {
      const priceObj = product.masterData?.current?.masterVariant?.prices?.[0];
      if (!priceObj?.value?.centAmount) return null;

      const priceValue = priceObj.value;
      const discountedValue = priceObj.discounted?.value;

      return {
        current: discountedValue || priceValue,
        original: discountedValue ? priceValue : null,
        hasDiscount: !!discountedValue,
      };
    } catch {
      return null;
    }
  };

  const priceInfo = getProductPrice(product);

  return (
    <div className={styles.productCard} onClick={() => navigate(`/products/${product.id}`)}>
      <div className={styles.imageContainer}>
        <img
          src={mainImage || '/placeholder-product.jpg'}
          alt={productName}
          className={styles.productImage}
          loading="lazy"
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{highlightText(productName, searchQuery)}</h3>
        {productDescription && (
          <p className={styles.productDescription}>
            {highlightText(productDescription, searchQuery)}
          </p>
        )}
        <div className={styles.priceContainer}>
          {priceInfo ? (
            <>
              <span
                className={priceInfo.hasDiscount ? styles.discountedPrice : styles.currentPrice}
              >
                ${(priceInfo.current.centAmount / 100).toFixed(2)}
              </span>
              {priceInfo.original && (
                <span className={styles.originalPrice}>
                  ${(priceInfo.original.centAmount / 100).toFixed(2)}
                </span>
              )}
            </>
          ) : (
            <span className={styles.currentPrice}>Price not specified</span>
          )}
        </div>
      </div>
    </div>
  );
};
