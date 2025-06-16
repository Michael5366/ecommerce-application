import { Box, Container, Typography } from '@mui/material';
import footerStyles from './footer-styles';

const Footer = () => {
  const css = footerStyles();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fff',
        borderTop: '1px solid #333',
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography className={css.footer__text} component={'div'} variant="body2">
          © {new Date().getFullYear()} This is an educational project. All rights reserved.
          <a className={css.footer__logo} href="https://rs.school/" target="blank">
            <img src="/rss-logo.svg" alt="logo" />
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
