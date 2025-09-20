import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './Admin/admin.css';
import App from './App.jsx';
import { APIConnectorContextProvider } from './Contexts/APIConnectorContext.jsx';
import { UserContextProvider } from './Contexts/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIConnectorContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </APIConnectorContextProvider>
  </StrictMode>,
);
