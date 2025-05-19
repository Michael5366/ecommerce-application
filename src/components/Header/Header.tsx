import { AppBar, Container, Stack, Toolbar, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import { showMenu } from './ShowMenu';

const Header = () => {
  return (
    <AppBar position="static">
      <Container disableGutters>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none' }}>
            🌸 Flower Shop
          </Typography>

          <Stack direction="row" spacing={2}>
            {showMenu()}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
