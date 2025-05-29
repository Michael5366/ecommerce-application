import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useStyles } from './product-page-style';

import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import { useParams, useLoaderData } from 'react-router-dom';
import { Product } from '../../types/product';
import { SliderDetail } from '../../components/Slider/Slider';

const ProductPage = () => {
  const css = useStyles();
  const { productName } = useParams();
  const products = useLoaderData();

  const product = products.find(
    (product: Product) => product.name.en.toLowerCase() === productName?.toLowerCase()
  );
  console.log('product:', product);

  if (!product) {
    return <div>Product not found</div>;
  }

  const { id, name, description, masterVariant } = product;
  // const images = masterVariant.images || [];
  const images = [{ url: '/1.jpg' }, { url: '/2.jpg' }, { url: '/3.jpg' }];
  const price = masterVariant.prices?.[0];
  const regularPrice = price?.value;
  const discountedPrice = price?.discounted?.value;

  return (
    <Container>
      <Box className={css.product} component={'div'}>
        <SliderDetail id={id} name={name} images={images} />
        <Box component="div">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {name.ru || name.en}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {description?.ru || description?.en}
          </Typography>

          <Typography variant="h6">
            Цена:{' '}
            {discountedPrice ? (
              <>
                <Box component="span">
                  {regularPrice?.centAmount / 100} {regularPrice?.currencyCode}
                </Box>
                <Box component="span">
                  {discountedPrice.centAmount / 100} {discountedPrice.currencyCode}
                </Box>
              </>
            ) : (
              <Box component="span">
                {regularPrice?.centAmount / 100} {regularPrice?.currencyCode}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
    </Container>
    // <div className={styles.product}>
    //   <img className={styles.product__img} src={imageUrl} alt={name.en || name.ru} />
    //   <h4 className={styles.product__title}> {name.ru || name.en}</h4>
    //   <p className={styles.product__description}> {description?.ru || description?.en}</p>
    //   <p className={styles.product__price}>
    //     Цена: {priceInfo?.centAmount / 100} {priceInfo?.currencyCode}
    //   </p>
    // </div>
    // <Container maxWidth="md" sx={{ mt: 4 }}>
    //   <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
    //     <Grid container spacing={4}>
    //       {imageUrl && (
    //         <Card sx={{ borderRadius: 2 }}>
    //           <CardMedia
    //             component="img"
    //             image={imageUrl}
    //             alt={name.ru || name.en}
    //             sx={{ maxHeight: 400, objectFit: 'contain' }}
    //           />
    //         </Card>
    //       )}
    //     </Grid>

    //     <Typography variant="h4" fontWeight="bold" gutterBottom>
    //       {name.ru || name.en}
    //     </Typography>

    //     <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
    //       {description?.ru || description?.en}
    //     </Typography>

    //     <Typography variant="h6">
    //       Цена:{' '}
    //       <Box component="span" fontWeight="bold">
    //         {priceInfo?.centAmount / 100} {priceInfo?.currencyCode}
    //       </Box>
    //     </Typography>
    //   </Paper>
    // </Container>
  );
};

export default ProductPage;
