import { makeStyles } from '@mui/styles';

const layoutStyles = makeStyles({
  layout__loader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.6)',
    zIndex: 9999,
  },
});

export default layoutStyles;
