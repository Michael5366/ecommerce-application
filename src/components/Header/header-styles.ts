import { makeStyles } from '@mui/styles';
import { theme } from '../../styles/theme';

const HeaderStyles = makeStyles({
  logo: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
});

export default HeaderStyles;
