// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './styles/App.css';

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<App />);



// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/App.css"; // load global styles once

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
