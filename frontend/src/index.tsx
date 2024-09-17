import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import axios from 'axios';

// Preventing Render Web services from spin down due to inactivity
const url = `https://kcurr-backend-dev.onrender.com/`;
const interval = 30000; // Interval in milliseconds (30 seconds)

const reloadWebsite = () => {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}
setInterval(reloadWebsite, interval);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <Router>
        <App />
    </Router>
);
