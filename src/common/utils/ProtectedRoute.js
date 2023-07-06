import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";


const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const userToken = atob(localStorage.getItem('authToken'));
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return navigate('/login');
        }
        setIsLoggedIn(true);
    }
    
    useEffect(() => {
            checkUserToken();
        }, [isLoggedIn]);


    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}

export default ProtectedRoute