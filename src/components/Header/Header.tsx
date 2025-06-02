import { AppBar, Container, Stack, Toolbar, Typography, useTheme } from '@mui/material';

import { Link } from 'react-router-dom';
import ShowMenu from './ShowMenu';

const Header = () => {
  const theme = useTheme();
  return (
    <AppBar position="static">
      <Container disableGutters>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: theme.palette.text.primary }}
          >
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
