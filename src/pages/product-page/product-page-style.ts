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
    marginRight: '0.5rem',
  },
  price__discount: {
    display: 'inline-block',
    paddingLeft: '0.5em',
    color: 'red',
    fontWeight: 'bold',
  },
  cartButton: {
    fontSize: 23,
    position: 'relative',
    '&:hover': {
      backgroundColor: '#b780fe',
    },
    '&.inCart': {
      backgroundColor: '#dc3545',
      '&:hover': {
        backgroundColor: '#9c1724',
      },
    },
    '&:disabled': {
      backgroundColor: '#e0e0e0',
    },
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});
