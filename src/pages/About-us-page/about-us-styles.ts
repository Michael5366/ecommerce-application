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
  },

  content__header: {
    order: 5,
  },

  content__avatar: {
    order: 1,
    width: '100px',
    height: '100px',
    borderRadius: '100%',
    paddingBottom: '20px',
  },

  content__quote: {
    order: 2,
    textAlign: 'center',
    fontSize: '1rem',
  },

  content__position: {
    order: 6,
    margin: 0,
  },

  content__description: {
    fontSize: '0.9rem',
    order: 3,
  },

  content__biography: {
    order: 4,
    color: theme.palette.text.hover,
    cursor: 'pointer',
    marginTop: 'auto',
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
