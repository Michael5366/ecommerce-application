import { makeStyles } from '@mui/styles';
import { theme } from '../../styles/theme';

const aboutPageStyles = makeStyles({
  wrapper: {
    boxShadow: `0px 0px 15px ${theme.palette.background.paper}`,
  },

  'about-us': {
    // outline: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: theme.palette.text.secondary,
    width: '100%',
    minHeight: '70vh',
    padding: '20px',

    '@media (max-width: 600px)': {
      padding: '0px',
    },
  },

  'about-us__headers': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '70%',
    color: 'inherit',
    textAlign: 'center',
  },

  'about-us__header': {
    fontSize: '3rem',
    color: 'inherit',
  },

  'about-us__description': {
    fontSize: '1rem',
    width: '50%',
    color: 'inherit',
    marginTop: 0,

    '@media (max-width: 1310px)': {
      width: '100%',
    },
  },

  content: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    width: '100%',
    marginTop: '20px',
  },

  content__card: {
    // outline: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: '40vh',
    width: '300px',
    padding: '40px',
    boxShadow: `0px 0px 15px ${theme.palette.background.paper}`,

    '@media (max-width: 345px)': {
      padding: 0,
    },
  },

  content__header: {
    order: 5,
    paddingTop: '10px',
  },

  content__avatar: {
    order: 1,
    objectFit: 'cover',
    width: '250px',
    height: '250px',
    borderRadius: '108%',
  },

  content__quote: {
    order: 2,
    textAlign: 'center',
    fontSize: '1rem',
    marginTop: '20px',
  },

  content__position: {
    order: 6,
    margin: 0,
  },

  content__description: {
    order: 3,
    fontSize: '0.9rem',
    marginTop: '20px',
  },

  content__btn: {
    order: 4,
    all: 'unset',
    color: theme.palette.text.hover,
    cursor: 'pointer',
    marginTop: 'auto',
  },

  content__modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content__biography: {
    position: 'relative',
    textAlign: 'center',
    fontSize: '20px',
    color: theme.palette.text.primary,
    width: '50%',
    padding: '40px',
    borderRadius: '3px',
    background: theme.palette.background.default,
  },

  'content__close-btn': {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#333',
    zIndex: 10,
    transition: 'all 0.3s ease',

    '&:hover': {
      color: theme.palette.text.hover,
    },
  },

  content__link: {
    order: 7,
    color: 'inherit',
    textDecoration: 'none',
    marginTop: '10px',
    transition: 'all 0.3s ease',

    '&:hover': {
      color: theme.palette.text.hover,
    },
  },
});

export default aboutPageStyles;
