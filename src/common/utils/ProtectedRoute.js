import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";


const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);

    const checkUserToken = () => {
        if (!isAuthenticated) {
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