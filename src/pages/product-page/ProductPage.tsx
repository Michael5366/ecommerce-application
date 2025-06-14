import { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useStyles } from './product-page-style';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useParams, useLoaderData } from 'react-router-dom';
import { Price, Product } from '../../types/product';
import { SliderDetail } from '../../components/Slider/Slider';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const ProductPage = () => {
  const css = useStyles();
  const { t, i18n } = useTranslation();
  const { productSlug } = useParams();
  const products = useLoaderData();
  const { addToCart, removeFromCart, productInCart, refreshCart } = useCart();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (!Array.isArray(products)) return;

    const product = products.find((product: Product) => {
      const enName = product.name.en.toLowerCase().replace(/\s+/g, '-');
      const ruName = product.name.ru?.toLowerCase().replace(/\s+/g, '-') || '';
      const slug = productSlug?.toLowerCase();
      return enName === slug || ruName === slug;
    });

    setCurrentProduct(product || null);
  }, [products, productSlug]);

  const handleAddToCart = async () => {
    if (!currentProduct?.id) return;

    setIsProcessing(true);
    try {
      await addToCart(currentProduct.id);
      setSnackbarMessage(t('Product added to Cart'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refreshCart();
    } catch {
      setSnackbarMessage(t('Failed to add product'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!currentProduct?.id) return;

    setIsProcessing(true);
    try {
      await removeFromCart(currentProduct.id);
      setSnackbarMessage(t('Product removed from Cart'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await refreshCart();
    } catch {
      setSnackbarMessage(t('Failed to remove product'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!Array.isArray(products)) {
    return <div>{t('loading')}</div>;
  }

  if (!currentProduct || !currentProduct.id) {
    return <div>{t('productNotFound')}</div>;
  }

  const { id, name, description, masterVariant } = currentProduct;
  const images: { url: string }[] = masterVariant.images || [];
  const price: Price | undefined = masterVariant.prices?.[0];
  const regularPrice = price?.value;
  const discountedPrice = price?.discounted?.value;
  const isInCart = productInCart(id);

  return (
    <Container>
      <Box className={css.product} component={'div'}>
        {id && <SliderDetail id={id} name={name} images={images} />}

        <Box className={css.product__info} component="div">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {i18n.language === 'ru' ? name.ru || name.en : name.en}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {i18n.language === 'ru' ? description?.ru || description?.en : description?.en}
          </Typography>

          <Typography variant="h6">
            {t('price')}:{' '}
            {discountedPrice && regularPrice ? (
              <>
                <Box className={css.price__regular} component="span">
                  {(regularPrice.centAmount / 100).toFixed(2)} {regularPrice?.currencyCode}
                </Box>
                <Box className={css.price__discount} component="span">
                  {(discountedPrice.centAmount / 100).toFixed(2)} {discountedPrice.currencyCode}
                </Box>
              </>
            ) : (
              <Box component="span">
                {regularPrice && (regularPrice.centAmount / 100).toFixed(2)}{' '}
                {regularPrice && regularPrice.currencyCode}
              </Box>
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
          disabled={isProcessing}
          className={`${css.cartButton} ${isInCart ? 'inCart' : ''}`}
          startIcon={isInCart ? <RemoveShoppingCartIcon /> : <ShoppingCartIcon />}
          sx={{
            minWidth: '200px',
            marginTop: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          {isInCart ? t('Remove from Cart') : t('Add to Cart')}
          {isProcessing && (
            <CircularProgress size={24} className={css.buttonProgress} color="inherit" />
          )}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
