import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  product: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  product__info: {
    marginTop: '2em',
  },

  price__regular: {
    textDecoration: 'line-through',
    color: 'gray',
    mr: 1,
  },

  price__discount: {
    display: 'inline-block',
    paddingLeft: '0.5em',
    color: 'red',
    fontWeight: 'bold',
  },
});
