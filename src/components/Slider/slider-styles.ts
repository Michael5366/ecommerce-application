import { makeStyles } from '@mui/styles';

export const sliderStyles = makeStyles({
  slider: {
    // outline: '3px solid #bbb',
    // display: 'flex',
    width: '45%',
    maxWidth: '100%',
    height: '60vh',
  },
  slider__img: {
    width: '100%',
    height: '60vh',
    objectFit: 'cover',
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
