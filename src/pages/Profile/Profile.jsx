import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "../../utils/UserService";
import { Link } from "react-router-dom";
import "./profile.css";

export const Profile = () => {
  const [loadData, setloadData] = useState([]);
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [imgData, setImgData] = useState(null);

  const data = useSelector((store) => store.auth.data);

  const loadingData = async () => {
    const response = await UserService.getOne(data.userId);
    setloadData(response.data);

    setImgData(
      `https://themonkeys.tech/api/v1/files/profile/${data.userId}/profile`
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadingData();
    }
  }, []);

  return (
    <div className="rootProfile">
      <div className="header-root">
        <p component="h1" className="headingProfile">
          Hi, Monkey !
        </p>

        <p className="greeting">Welcome back! Happy Reading!</p>
      </div>

      <div className="profileConatiner">
        <div className="leftCotainer">
          <h4 className="profileHeadingLeft">Profile Overview</h4>
          <div className="profileSection">
            <div className="leftDetails">
              <p className="profileText">
                <h5 className="profileSubHeading">Name :</h5>
                The monkey
              </p>
              <p className="profileText">
                <h5 className="profileSubHeading">Email : </h5>
                goyalyash1211@gmail.com
              </p>
              <p className="profileText">
                <h5 className="profileSubHeading">Member since :</h5> Dec
                25,2023
              </p>
            </div>
          </div>

          <div className="myOrder">
            <p component="h1" className="profileHeading">
              Blogs
            </p>
            <Link
              to="/orders"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <button className="blogsbutton">Blogs</button>
            </Link>
          </div>
        </div>

        <div className="rightConatiner">
          <div className="righHeadings">
            <p component="h1" className="profileHeading">
              Personal Information
            </p>
            <p className="profileText2">
              Hey there ! Feel free to edit any of your details below so your
              account is up to date.
            </p>
          </div>
          <div className="profileDetials">
            <div className="detials">
              <p component="h1" className="profileHeading">
                MY DETAILS
              </p>
              <p className="profileText">The Monkey</p>
              <p className="profileText">goyalyash1211@gmail.com</p>
              <p className="profileText"> PHONE NUMBER</p>
              <p className="profileText">Male</p>
            </div>

            <Link to="/profile/update" style={{ textDecoration: "none" }}>
              <button className="profilebutton">EDIT DETAILS</button>
            </Link>
            <div className="detials">
              <p
                component="h1"
                className="profileHeading"
                style={{ marginTop: "1.5rem" }}
              >
                LOGIN DETAILS
              </p>
              <p className="profileSubHeading">EMAIL</p>
              <p className="profileText">goyalyash1211@gmail.com</p>

              <p className="profileSubHeading" style={{ marginTop: "10px" }}>
                PASSWORD
              </p>
              <p className="profileSubHeading">*************</p>
            </div>
            <Link
              to="/password/update"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <button className="profilebutton">UPDATE PASSWORD</button>
            </Link>

            <div className="mangeAccount">
              <p component="h1" className="profileHeading">
                Log out from all devices
              </p>

              <p className="profileText3">
                To access the Cricket Weapon Store website again, you need to
                provide your credentials. This action will log you out from any
                other web browsers you have used before.
              </p>
            </div>
            <button color="primary" className="profilebutton">
              Logout Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
