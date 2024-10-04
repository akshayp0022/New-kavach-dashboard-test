import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

function ProtectedRoutes() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (!savedToken && !token) {
      navigate('/login'); 
    }
  }, [token, navigate]);

  return <Outlet />;
}

export default ProtectedRoutes;
