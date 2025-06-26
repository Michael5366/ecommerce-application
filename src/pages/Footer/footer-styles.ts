import { makeStyles } from '@mui/styles';

const footerStyles = makeStyles({
  footer__text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    color: '#333',
    fontSize: '0.8rem',
  },

  footer__logo: {
    display: 'flex',
    width: '30px',
  },
});

export default footerStyles;
