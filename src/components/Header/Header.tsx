import { AppBar, Container, Stack, Toolbar, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import ShowMenu from './ShowMenu';

import HeaderStyles from './header-styles';

const Header = () => {
  const css = HeaderStyles();

  return (
    <AppBar position="static">
      <Container disableGutters>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography className={css.logo} variant="h6" component={Link} to="/">
            🌸 Flower Shop
          </Typography>

          <Stack direction="row" spacing={2}>
            <ShowMenu />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
