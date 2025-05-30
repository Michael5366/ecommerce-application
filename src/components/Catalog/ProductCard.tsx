import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductPriceInfo, Category } from '../../types/productTypes';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  searchQuery: string;
  onAddToCart?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  categories,
  searchQuery,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const productName = product.masterData?.current?.name?.en || product.id;
  const productDescription = product.masterData?.current?.description?.en;
  const mainImage = product.masterData?.current?.masterVariant?.images?.[0]?.url;

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  const getCategorySlug = () => {
    const categoryId = product.masterData?.current?.categories?.[0]?.id;
    if (!categoryId) return null;

    const category = categories.find((c) => c.id === categoryId);
    return category ? generateSlug(category.name?.en || category.id) : null;
  };

  const handleProductClick = () => {
    const productSlug = generateSlug(productName);
    const categorySlug = getCategorySlug();

    if (categorySlug) {
      navigate(`/catalog/${categorySlug}/product/${productSlug}`);
    } else {
      navigate(`/catalog/product/${productSlug}`);
    }
  };

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
  const hasDiscount = priceInfo?.hasDiscount || false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  return (
    <div className={styles.productCard} onClick={handleProductClick}>
      {hasDiscount && <div className={styles.discountBadge}>Sale</div>}

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

      <div
        className={styles.cartIcon}
        onClick={handleAddToCart}
        title="Add to cart"
        aria-label="Add to cart"
      >
        <ShoppingCartIcon fontSize="small" />
      </div>
    </div>
  );
};
