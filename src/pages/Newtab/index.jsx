import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import Newtab from './Newtab';

import './index.css';

const queryClient = new QueryClient();


const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <QueryClientProvider client={queryClient}>
        <Newtab />
    </QueryClientProvider>);


