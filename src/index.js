import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from "react-helmet-async";
import ReduxProvider from './redux/ReduxProvider';



import App from "./app/App";
import Head from "./config/Head";

import { initialState } from './redux/initialState';
import { actions } from './redux/initialState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ReduxProvider initialState={initialState} actions={actions}>
        <HelmetProvider>

            <Head />
            <App />
        </HelmetProvider>
    </ReduxProvider>
);
