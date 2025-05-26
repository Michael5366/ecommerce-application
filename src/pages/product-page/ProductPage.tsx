import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Grid, Card, CardMedia, Typography, Box } from '@mui/material';
import { useParams, useLoaderData } from 'react-router-dom';
import { Product } from '../../types/product';

const ProductPage = () => {
  const { productName } = useParams();
  const products = useLoaderData() as Product[];
  console.log('products:', products);

  const product = products.find(
    (product: Product) => product.name.en.toLowerCase() === productName?.toLowerCase()
  );
  console.log('product:', product);

  if (!product) {
    return <div>Product not found</div>;
  }

  const { name, description, masterVariant } = product;
  const imageUrl = masterVariant.images?.[0]?.url;
  const priceInfo = masterVariant.prices?.[0]?.value;

  return (
    <Container className="product-page">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {imageUrl && (
            <Card sx={{ borderRadius: 2 }}>
              <CardMedia
                component="img"
                image={imageUrl}
                alt={name.ru || name.en}
                sx={{ maxHeight: 400, objectFit: 'contain' }}
              />
            </Card>
          )}
        </Grid>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {name.ru || name.en}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {description?.ru || description?.en}
        </Typography>

        <Typography variant="h6">
          Цена:{' '}
          <Box component="span" fontWeight="bold">
            {priceInfo ? priceInfo.centAmount / 100 : `priceInfo value: ${priceInfo}`}{' '}
            {priceInfo ? priceInfo.currencyCode : `priceInfo value: ${priceInfo}`}
          </Box>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProductPage;
