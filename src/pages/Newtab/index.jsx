import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import Newtab from './Newtab';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: (process.env.NODE_ENV === 'development') ? '#283593' : '#392e50',
        },
        // You can customize the theme further
    },
});

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* This is for a consistent baseline style */}
            <Newtab />
        </ThemeProvider>
    </QueryClientProvider>);
