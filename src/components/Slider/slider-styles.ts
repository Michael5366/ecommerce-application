import { makeStyles } from '@mui/styles';

export const sliderStyles = makeStyles({
  slider: {
    width: '1200px',
    maxWidth: '100%',
    height: 'auto',
    maxheight: '58.5vh',
    margin: '0 auto',
  },

  'slider__close-btn': {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#333',
    zIndex: 10,
    '&:hover': {
      color: '#000',
    },
  },

  slider__img: {
    width: '100%',
    height: '100%',
    maxHeight: '60vh',
    objectFit: 'cover',
    cursor: 'pointer',
    display: 'block',

    '@media (max-width: 1280px)': {
      // height: '50vh',
    },
    '@media (max-width: 768px)': {
      objectFit: 'cover',
      height: '60vh',
    },
    '@media (max-width: 480px)': {
      height: '50vh',
    },
  },
  modal__wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90%',
    maxWidth: '80%',
    background: '#fff',
    transform: 'translate(-50%, -50%)',
    boxShadow: '24',
    padding: 16,
    borderRadius: 8,
    outline: 'none',

    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
      maxHeight: '80vh',
      objectFit: 'contain',
      cursor: 'pointer',

      '@media (max-width: 768px)': {
        objectFit: 'cover',
      },

      '@media (max-width: 480px)': {
        objectFit: 'cover',
      },
    },
  },

  '@global': {
    '.slick-prev:before, .slick-next:before': {
      fontSize: '20px',
      color: '#bbb',
      transition: '0.3s',
    },
    '.slick-prev': {
      left: '-50px',
    },
    '.slick-next': {
      right: '-50px',
    },
    '@media (hover: hover)': {
      '.slick-prev:hover:before, .slick-next:hover:before': {
        color: '#000',
      },
    },
  },
});
