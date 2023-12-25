import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Cookie.css'
import cookie from "../../images/cookie.jpg";
import { Link } from "react-router-dom";

const Cookie = () => {
  useEffect(() => {
    const popUp = document.getElementById('cookiePopup');

    if (popUp) {
      const input = document.cookie.split('=');
      if (input[0] === 'myCookieName') {
        popUp.style.display = 'none';
      } else {
        popUp.classList.add('show');
      }
    }
  }, []);

  const cookieHandler = () => {
    const popUp = document.getElementById('cookiePopup');

    if (popUp) {
      let d = new Date();
      d.setMinutes(2 + d.getMinutes());
      document.cookie = 'myCookieName=thisIsMyCookie; expires=' + d + ';';
      popUp.classList.add('hide');
    }
  };

  return (
    <div className="cookie-container">
      <div className="cookiePopup" id="cookiePopup">
        <motion.img
          whileTap={{ scale: 0.75 }}
          draggable="false"
          className="flex items-center justify-center pt-2 md:w-60 w-50"
          src={cookie}
          alt="Cookies"
        />
        <p>
          Our website uses cookies to provide your browsing experience and
          relevant information. Before continuing to use our website, you agree
          & accept our{' '}
          <Link to="/cookiepolicy" className="link link-hover">Cookie Policy</Link>
        </p>
        <button id="acceptCookie" onClick={cookieHandler}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default Cookie;