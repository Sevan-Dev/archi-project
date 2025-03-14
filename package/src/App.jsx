// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors";

// ✅ Import correct depuis 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import router from "./routes/Router.js"

function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} /> {}
    </ThemeProvider>
  );
}

export default App;
