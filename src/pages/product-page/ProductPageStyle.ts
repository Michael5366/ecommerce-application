// theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customStyles: {
      productPageContainer: React.CSSProperties;
    };
  }
  interface ThemeOptions {
    customStyles?: {
      productPageContainer?: React.CSSProperties;
    };
  }
}

export const theme = createTheme({
  customStyles: {
    productPageContainer: {
      maxWidth: '960px',
      marginTop: '4rem',
    },
  },
});
export default theme;
