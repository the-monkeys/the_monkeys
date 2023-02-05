import React from "react";
import styles from "./auth.module.scss";
import { Card } from "../components/Card";
import { Link } from "react-router-dom";
import RegisterImg from "../../src/assets/login.png";

const Register = () => {
  return (
    <>
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2 style={{ color: "black" }}>Register</h2>
            <form>
              <input
                type="text"
                placeholder="Email"
                required
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password "
                required
                // value={cpassword}
                // onChange={(e) => setCpassword(e.target.value)}
              />
              <button className="--btn --btn-primary --btn-block" type="submit">
                Register
              </button>
            </form>

            <span className={styles.register}>
              <p>Already an account?</p>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </Card>
        <div>
          <img
            className={styles.img}
            src={RegisterImg}
            alt="register"
            width="400"
          />
        </div>
      </section>
    </>
  );
};

export default Register;
