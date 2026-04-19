import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { applyGlobalStyles } from './styles/global';

applyGlobalStyles();

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
