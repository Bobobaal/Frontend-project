import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Theme ({children}) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#c9292d',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}