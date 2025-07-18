// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Import App component

ReactDOM.render(
  <React.StrictMode>
    <App />  {/* Render the App component here */}
  </React.StrictMode>,
  document.getElementById('root')
);
