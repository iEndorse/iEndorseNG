import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider  } from '@react-oauth/google';

const CLIENT_ID = "235778258186-5uv9grf9jq6st83cks5sej6ii9t0nvge.apps.googleusercontent.com"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    
    <App />
  
    </GoogleOAuthProvider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
