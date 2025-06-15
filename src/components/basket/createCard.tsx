import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import styles from './cardsStiles.module.css';
interface CartItemCardProps {
  item: {
    id: string;
    name: { en: string; ru: string };
    productSlug: { en: string; ru: string };
    variant: {
      id: number;
      images?: Array<{ url: string }>;
      sku: string;
    };
    price: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
      discounted?: {
        value: {
          centAmount: number;
          currencyCode: string;
        };
      };
    };
    quantity: number;
    totalPrice: {
      centAmount: number;
    };
  };
  onRemove?: (itemId: string) => void;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
}

export const ProductCardBusket: FC<CartItemCardProps> = ({ item, onRemove, onQuantityChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const productName = item.name?.en || item.id;
  const mainImage = item.variant?.images?.[0]?.url;
  const pricePerItem = item.price.value.centAmount / 100;
  const totalPrice = item.totalPrice.centAmount / 100;

  const handleProductClick = () => {
    const productSlug = item.productSlug?.en || item.id;
    navigate(`/product/${productSlug}`);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(item.id);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    onQuantityChange?.(item.id, newQuantity);
  };

  return (
    <div className={styles.cardItemCard}>
      <div
        className={styles.imageContainer}
        onClick={handleProductClick}
        role="button"
        tabIndex={0}
      >
        <img
          src={mainImage || '/placeholder-product.jpg'}
          alt={productName}
          className={styles.productImage}
          loading="lazy"
        />
      </div>

      <div className={styles.itemInfo}>
        <h3 className={styles.productName}>{productName}</h3>
        <p className={styles.variantInfo}>SKU: {item.variant.sku}</p>

        <div className={styles.priceInfo}>
          {item.price.discounted ? (
            <>
              <span className={styles.originalPrice}>
                ${(item.price.value.centAmount / 100).toFixed(2)}
              </span>
              <span className={styles.discountedPrice}>
                ${(item.price.discounted.value.centAmount / 100).toFixed(2)} {t('each')}
              </span>
            </>
          ) : (
            <span className={styles.pricePerItem}>
              ${pricePerItem.toFixed(2)} {t('each')}
            </span>
          )}
          <span className={styles.totalPrice}>
            ${totalPrice.toFixed(2)} {t('total')}
          </span>
          npm test -- --coverage
        </div>
      </div>

      <div className={styles.quantityControl}>
        <select
          value={item.quantity}
          onChange={handleQuantityChange}
          className={styles.quantitySelect}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        className={styles.removeButton}
        onClick={handleRemoveClick}
        title={t('Remove from cart')}
        aria-label={t('Remove from cart')}
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  );
};
