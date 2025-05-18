import { AppBar, Stack, Toolbar, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import { showMenu } from './ShowMenu';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: '#ffffff', textDecoration: 'none' }}
        >
          🌸 Flower Shop
        </Typography>

        <Stack direction="row" spacing={2}>
          {showMenu()}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
