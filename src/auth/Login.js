import React from "react";
import styles from "./auth.module.scss";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import lodingImg from "../../src/assets/login.png";
import { FaGoogle } from "react-icons/fa";
import Card from "../component/card";
const Login = () => {
  return (
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img src={lodingImg} alt="Login" width={400} />
      </div>
      <Card>
        <div className={styles.form}>
          <h2 style={{ color: "black" }}>Login</h2>
          <form>
            <input type="text" placeholder="email" required />
            <input type="password" placeholder="password" required />
            <button className="--btn --btn-primary --btn-block" type={"submit"}>
              Login
            </button>
            <div className={styles.links} type={"submit"}>
              <Link to="/reset">Reset Password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <button className="--btn --btn-danger --btn-block">
            Login with <FaGoogle color="fff" style={{ margin: 5 }} />
          </button>
          <span className={styles.register}>
            <p>Don't have an account?</p>
            <Link to="/register"> Register</Link>
          </span>
        </div>
      </Card>
    </section>
  );
};

export default Login;
