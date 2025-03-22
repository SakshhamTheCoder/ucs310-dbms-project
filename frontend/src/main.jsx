import { AuthContextProvider } from './utils/AuthContext';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
    <Toaster position='top-right'/>
  </AuthContextProvider>,
);
