import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useStyles } from './product-page-style';

import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import { useParams, useLoaderData } from 'react-router-dom';
import { Price, Product } from '../../types/product';
import { SliderDetail } from '../../components/Slider/Slider';

const ProductPage = () => {
  const css = useStyles();
  const { productSlug } = useParams();
  const products = useLoaderData();

  console.log('ProductPage products:', products);
  console.log('ProductPage productSlug:', productSlug);

  const product = products.find(
    (product: Product) =>
      product.name.en.toLowerCase() === productSlug?.toLowerCase() ||
      product.name.ru?.toLowerCase() === productSlug?.toLowerCase()
  );

  console.log('ProductPage product:', product);

  if (!product) {
    return <div>Product not found</div>;
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
            {name.ru || name.en}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {description?.ru || description?.en}
          </Typography>

          <Typography variant="h6">
            Price:{' '}
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
