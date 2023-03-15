import { useState } from "react";
// import styles from "../../auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import LoginSvg from "../../../../assets/Login.svg";
import GoogleIcon from "../../../../assets/google-icon.svg";
// import { Card } from "../../../../components/Card";
// import { ProfileIcon } from "./components/Navigation/ProfileIcon/ProfileIcon";
import { ProfileIcon } from "../../../../components/Navigation/ProfileIcon/ProfileIcon";

export const Login = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid Email format";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      // reset form data
      setFormData({
        email: "",
        password: "",
      });
      setFormErrors({
        email: "",
      });
      navigate("/profile");
      alert("success");
      isLoggedIn(true);
    }
  };
  return (
    <section
      className="container mx-auto flex items-center justify-center md:justify-end"
      data-testid="login"
    >
      <div className="hidden md:block w-1/2 p-24 pl-0">
        <img className="slide" src={LoginSvg} alt="illustration" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="slideDown py-28 md:py-0 text-2xl md:w-1/2 md:pl-28 bg-white flex flex-col space-y-8"
      >
        <div>
          <label>Email:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 mb-2 w-full p-4"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Enter your Email"
            required
          />
          {formErrors.email && (
            <span className="text-red-500">{formErrors.email}</span>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
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
          <button className="flex items-center justify-center w-full bg-white p-4 text-bold text-grey shadow-md space-x-4">
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

// fn ln email pas
