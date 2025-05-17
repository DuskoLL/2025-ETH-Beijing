import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  Grid, 
  CssBaseline 
} from '@mui/material';
// Redux已在index.tsx中提供，这里不需要重复导入
// import { Provider } from 'react-redux';
// import { store } from './store/index';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreditScore from './pages/CreditScore';
import Lending from './pages/Lending';
import SimpleLending from './pages/SimpleLending';
import Dashboard from './pages/Dashboard';
import Repayment from './pages/Repayment';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff8a',
      light: '#5cffac',
      dark: '#00cc6e',
    },
    secondary: {
      main: '#00e676',
      light: '#66ffa6',
      dark: '#00b248',
    },
    background: {
      default: '#0a1a12',
      paper: '#0e2218',
    },
    success: {
      main: '#00e676',
    },
    warning: {
      main: '#00ffea',
    },
    error: {
      main: '#ff5252',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #3a7bd5 0%, #00d4ff 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2d62ab 0%, #00b8dd 100%)',
          },
        },
      },
    },
  },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/credit-score" element={<CreditScore />} />
            <Route path="/lending" element={<Lending />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/repayment" element={<Repayment />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
