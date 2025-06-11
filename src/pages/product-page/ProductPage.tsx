import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useStyles } from './product-page-style';

import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import { useParams, useLoaderData } from 'react-router-dom';
import { Price, Product } from '../../types/product';
import { SliderDetail } from '../../components/Slider/Slider';

import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const css = useStyles();
  const { t, i18n } = useTranslation();
  const { productSlug } = useParams();
  const products = useLoaderData();

  if (!Array.isArray(products)) {
    return <div>{t('loading')}</div>;
  }

  const currentLang = i18n.language || 'en';

  const product = products.find((product: Product) => {
    const enName = product.name.en.toLowerCase().replace(/\s+/g, '-');
    const ruName = product.name.ru?.toLowerCase().replace(/\s+/g, '-') || '';
    const slug = productSlug?.toLowerCase();

    return enName === slug || ruName === slug;
  });

  if (!product) {
    return <div>{t('productNotFound')}</div>;
  }

  const { id, name, description, masterVariant } = product;
  const images: { url: string }[] = masterVariant.images || [];
  const price: Price | undefined = masterVariant.prices?.[0];
  const regularPrice = price?.value;
  const discountedPrice = price?.discounted?.value;

  return (
    <Container>
      <Box className={css.product} component={'div'}>
        {id && <SliderDetail id={id} name={name} images={images} />}

        <Box className={css.product__info} component="div">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {currentLang === 'ru' ? name.ru || name.en : name.en}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {currentLang === 'ru' ? description?.ru || description?.en : description?.en}
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
      </Box>
    </Container>
  );
};

export default ProductPage;
