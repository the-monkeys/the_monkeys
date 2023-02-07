// import React from "react";
// import styles from "../../auth.module.scss";
import { Link } from "react-router-dom";
import LoginSvg from "../../../../assets/Login.svg";
import GoogleIcon from "../../../../assets/google-icon.svg";
// import { Card } from "../../../../components/Card";

export const Login = () => {
  return (
    <section className="container mx-auto flex items-center justify-center md:justify-end">
      <div className="hidden md:block w-1/2 p-24 pl-0">
        <img className="slide" src={LoginSvg} alt="illustration" />
      </div>
      <form className="slideDown py-28 md:py-0 text-2xl md:w-1/2 md:pl-28 bg-white flex flex-col space-y-8">
        <div>
          <label>Email:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            type="email"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            type="password"
            placeholder="Enter your Password"
            required
          />
        </div>
        <div className="flex space-x-2 items-center">
          <input className="w-6 h-6" type="checkbox" />
          <span className="text-gray-700">Keep me Signed In</span>
        </div>
        <button
          className="border-solid border-2 bg-lightBlack p-4 text-white hover:text-lightBlack border-lightBlack hover:bg-transparent"
          type="submit"
        >
          Sign In
        </button>
        <div className="w-full flex space-x-2">
          <p className="text-md">Don't have an Account?</p>
          <Link className="text-2xl underline" to="/register">
            Register
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between items-center">
          <p>Or</p>
          <button className="flex items-center w-full bg-white p-4 text-bold text-grey shadow-md space-x-4">
            <img src={GoogleIcon} alt="google-icon" className="h-12" />
            <span>Login with Google</span>
          </button>
        </div>
      </form>
    </section>
    // <section className={`container ${styles.auth}`}>
    //   <div className={styles.img}>
    //     <img src={lodingImg} alt="Login" width={400} />
    //   </div>
    //   <Card>
    //     <div className={styles.form}>
    //       <h2 style={{ color: "black" }}>Login</h2>
    //       <form>
    //         <input type="text" placeholder="email" required />
    //         <input type="password" placeholder="password" required />
    //         <button className="--btn --btn-primary --btn-block" type={"submit"}>
    //           Login
    //         </button>
    //         <div className={styles.links} type={"submit"}>
    //           <Link to="/reset">Reset Password</Link>
    //         </div>
    //         <p>-- or --</p>
    //       </form>
    //       <button className="--btn --btn-danger --btn-block">
    //         Login with <FaGoogle color="fff" style={{ margin: 5 }} />
    //       </button>
    //       <span className={styles.register}>
    //         <p>Don't have an account?</p>
    //         <Link to="/register"> Register</Link>
    //       </span>
    //     </div>
    //   </Card>
    // </section>
  );
};
