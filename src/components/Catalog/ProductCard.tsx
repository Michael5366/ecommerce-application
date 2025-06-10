import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductPriceInfo, Category } from '../../types/productTypes';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styles from './ProductCard.module.css';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  searchQuery: string;
  isInCart?: boolean;
  onAddToCart?: (productId: string) => Promise<void>;
  isLoading?: boolean;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  categories,
  searchQuery,
  isInCart: initialIsInCart = false,
  onAddToCart,
  isLoading: globalLoading = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [localIsInCart, setLocalIsInCart] = useState(initialIsInCart);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productName = product.masterData?.current?.name?.en || product.id;
  const productDescription = product.masterData?.current?.description?.en;
  const mainImage = product.masterData?.current?.masterVariant?.images?.[0]?.url;

  useEffect(() => {
    setLocalIsInCart(initialIsInCart);
  }, [initialIsInCart]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  const getCategorySlug = () => {
    const categoryId = product.masterData?.current?.categories?.[0]?.id;
    if (!categoryId) return null;

    const category = categories.find((category) => category.id === categoryId);
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
    if (!highlight.trim() || !text) {
      return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className={styles.highlightedText}>
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localIsInCart || isAdding || globalLoading) return;

    setIsAdding(true);
    setError(null);
    try {
      setLocalIsInCart(true);
      if (onAddToCart) {
        await onAddToCart(product.id);
      }
    } catch (err) {
      setLocalIsInCart(false);
      console.error('Error adding to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.productCard} onClick={handleProductClick} role="button" tabIndex={0}>
      {hasDiscount && <div className={styles.discountBadge}>{t('Sale')}</div>}

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
            <span className={styles.currentPrice}>{t('Price not specified')}</span>
          )}
        </div>
      </div>

      <button
        className={`${styles.addToCartButton} ${localIsInCart ? styles.inCart : ''}`}
        onClick={handleAddToCart}
        disabled={localIsInCart || isAdding || globalLoading}
        aria-label={localIsInCart ? t('In cart') : t('Add to cart')}
      >
        {isAdding ? (
          <span className={styles.spinner}></span>
        ) : localIsInCart ? (
          t('In cart')
        ) : (
          <>
            <ShoppingCartIcon fontSize="small" />
            <span>{t('Add to cart')}</span>
          </>
        )}
      </button>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
