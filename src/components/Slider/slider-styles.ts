import { makeStyles } from '@mui/styles';

export const sliderStyles = makeStyles({
  slider: {
    // outline: '3px solid #bbb',
    // display: 'flex',
    width: '45%',
    maxWidth: '100%',
    height: '60vh',
  },
  slide: {
    '&.slick-active img': {
      pointerEvents: 'auto',
    },
  },
  slider__img: {
    width: '35vw',
    height: '60vh',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  modal__wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    background: 'background.paper',
    boxShadow: '24',
    p: 2,
    borderRadius: 2,
    outline: 'none',

    '& img': {
      width: '100%',
      height: '80vh',
      pointerEvents: 'none',
    },
  },

  // slick arrows
  '@global': {
    '.slick-prev:before, .slick-next:before': {
      // background: '#000',
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
