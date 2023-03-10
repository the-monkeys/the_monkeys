// import React from "react";
// import styles from "../../auth.module.scss";
// import { Card } from "../../../../components/Card";
import { Link } from "react-router-dom";
import RegisterImg from "../../../../assets/register.svg";
import GoogleIcon from "../../../../assets/google-icon.svg";

export const Register = () => {
  return (
    <section className="container mx-auto flex items-center justify-center md:justify-end">
      <div className="hidden md:block w-1/2 p-24 pl-0">
        <img className="slide" src={RegisterImg} alt="illustration" />
      </div>
      <form className="slideDown py-12 md:py-28 text-2xl md:w-1/2 md:pl-28 bg-white flex flex-col space-y-6">
        <div>
          <label>Name:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            type="name"
            placeholder="Enter your Name"
            required
          />
        </div>
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
        <div>
          <label>Confirm Password:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            type="password"
            placeholder="Re-enter your Password"
            required
          />
        </div>
        <div className="flex space-x-2 items-center">
          <input className="w-6 h-6" type="checkbox" />
          <span className="text-gray-700">Keep me Signed In</span>
        </div>
        <p className="text-md">
          By creating an Account, I agree to{" "}
          <Link className="text-blue-500" to="/tos">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="text-blue-500" to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          className="border-solid border-2 bg-lightBlack p-4 text-white hover:text-lightBlack border-lightBlack hover:bg-transparent"
          type="submit"
        >
          Sign Up
        </button>
        <div className="w-full flex space-x-2">
          <p className="text-md">Already a Member?</p>
          <Link className="text-2xl underline" to="/login">
            Login
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between items-center">
          <p>Or</p>
          <Link to='' className="flex items-center justify-center w-full bg-white p-4 text-bold text-grey shadow-md space-x-4">
            <img src={GoogleIcon} alt="google-icon" className="h-12" />
            <span>Login with Google</span>
          </Link>
        </div>
      </form>
    </section>
    // <>
    //   <section className={`container ${styles.auth}`}>
    //     <Card>
    //       <div className={styles.form}>
    //         <h2 style={{ color: "black" }}>Register</h2>
    //         <form>
    //           <input
    //             type="text"
    //             placeholder="Email"
    //             required
    //             // value={email}
    //             // onChange={(e) => setEmail(e.target.value)}
    //           />
    //           <input
    //             type="password"
    //             placeholder="Password"
    //             required
    //             // value={password}
    //             // onChange={(e) => setPassword(e.target.value)}
    //           />
    //           <input
    //             type="password"
    //             placeholder="Confirm Password "
    //             required
    //             // value={cpassword}
    //             // onChange={(e) => setCpassword(e.target.value)}
    //           />
    //           <button className="--btn --btn-primary --btn-block" type="submit">
    //             Register
    //           </button>
    //         </form>

    //         <span className={styles.register}>
    //           <p>Already an account?</p>
    //           <Link to="/login">Login</Link>
    //         </span>
    //       </div>
    //     </Card>
    //     <div>
    //       <img
    //         className={styles.img}
    //         src={RegisterImg}
    //         alt="register"
    //         width="400"
    //       />
    //     </div>
    //   </section>
    // </>
  )
}
