import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './context/ThemeProvider';
import NotificationProvider from './context/NotificationProvider';
import AuthProvider from './context/AuthProvider';
import SearchProvider from './context/SearchProvider';
import MoviesProvider from './context/MoviesProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ThemeProvider>
    <BrowserRouter>
    <NotificationProvider>
      <SearchProvider>
        <MoviesProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </MoviesProvider>
      </SearchProvider>
      </NotificationProvider>
    </BrowserRouter>
    </ThemeProvider>
  // </React.StrictMode>
);

