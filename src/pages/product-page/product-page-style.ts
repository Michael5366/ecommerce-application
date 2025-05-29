import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  product: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

/* .product {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.product__img {
  grid-column: 1/2;
  grid-row: 1/-1;
  width: 30vw;
}

.product__title {
  grid-column: 2/-1;
  grid-row: 1/2;
}

.product__description {
}

.product__price {
} */
