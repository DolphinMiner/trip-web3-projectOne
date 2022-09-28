import React from 'react';
import ReactDOM from 'react-dom/client';
import {DApp} from "./components/DApp";

import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DApp />
  </React.StrictMode>
);

