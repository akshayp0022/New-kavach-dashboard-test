import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../AppContext';

function ProtectedRoutes({ Component }) {
    let { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    console.log(isLoggedIn)

    useEffect(() => {
        if(!isLoggedIn){
            navigate('login')
        }
    }, [isLoggedIn])
    return (
        <Outlet />
    )
}

export default ProtectedRoutes
