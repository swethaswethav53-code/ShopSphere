import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);