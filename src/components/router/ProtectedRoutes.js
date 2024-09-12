import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../AppContext';

function ProtectedRoutes({ Component }) {
    const  navigate = useNavigate();
    let { isLoggedIn } = useAppContext();
    console.log(isLoggedIn)

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/login');
        }
    })
    return (
        Component
    )
}

export default ProtectedRoutes
