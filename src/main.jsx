import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Global styles (order matters: Bootstrap first, then custom overrides)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/app.css';

// App-wide providers: authentication state + dark mode
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DataProvider } from './context/DataContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
