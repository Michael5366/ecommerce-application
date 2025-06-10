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
    color: 'inherit',
  },

  content: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    width: '100%',
  },

  content__card: {
    // outline: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: '30vh',
    width: '340px',
    boxShadow: `0px 0px 15px ${theme.palette.background.paper}`,
  },

  content__avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '100%',
  },

  content__link: {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'all 0.3s ease',

    '&:hover': {
      color: theme.palette.text.hover,
    },
  },
});

export default aboutPageStyles;
