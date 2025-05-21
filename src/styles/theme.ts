import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: '#333333',
          color: '#333333',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#333333',
            color: '#ffffff',
            borderColor: '#333333',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#333333',
          '&:hover': {
            backgroundColor: '#333333',
            color: '#ffffff',
          },
        },
      },
    },
  },
});
