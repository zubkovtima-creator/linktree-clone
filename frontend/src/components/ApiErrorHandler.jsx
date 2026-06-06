import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setUnauthorizedHandler } from '../services/api';

function ApiErrorHandler() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (isAuthenticated || localStorage.getItem('token')) {
        logout();
        navigate('/login', { replace: true });
      }
    });
  }, [logout, navigate, isAuthenticated]);

  return null;
}

export default ApiErrorHandler;
