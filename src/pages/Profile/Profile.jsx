import React, { useEffect, useState } from "react";
import ImgBg from "../../images/profilebg.jpeg";
import { HiUserCircle } from "react-icons/hi";
import { AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobephotoshop,
  SiAdobexd,
} from "react-icons/si";
import { useSelector } from "react-redux";
import UserService from "../../utils/UserService";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./profile.css";
import { useHistory } from "react-router-dom";

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
        <Typography variant="h5" component="h1" className="headingProfile">
          Hi, Monkey !
        </Typography>

        <Typography variant="body2" className="greeting">
          Welcome back! Happy Reading!
        </Typography>
      </div>

      <div className="profileConatiner">
        <div className="leftCotainer">
          <h4
          
            className="profileHeadingLeft"
          >
            Profile Overview
          </h4>
          <div className="profileSection">
            <Avatar
              alt="Monkey Image"
              src="../../images/the_monkeys.png"
              className="profileAvatar"
            />
            <div className="leftDetails">
              <Typography className="profileText">
                <h5 className="profileSubHeading">Name :</h5>
                The monkey
              </Typography>
              <Typography className="profileText">
                <h5 className="profileSubHeading">Email : </h5>
               goyalyash1211@gmail.com
              </Typography>
              <Typography className="profileText">
                <h5 className="profileSubHeading">Member since :</h5>{" "}
                Dec 25,2023
              </Typography>
            </div>
          </div>

          <div className="myOrder">
            <Typography variant="h4" component="h1" className="profileHeading">
              Blogs
            </Typography>
            <Link
              to="/orders"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" className="blogsButton">
                Blogs
              </Button>
            </Link>
          </div>
        </div>

        <div className="rightConatiner">
          <div className="righHeadings">
            <Typography variant="h4" component="h1" className="profileHeading">
              Personal Information
            </Typography>
            <Typography className="profileText2">
              Hey there ! Feel free to edit any of your details below so your
              account is up to date.
            </Typography>
          </div>
          <div className="profileDetials">
            <div className="detials">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
              >
                MY DETAILS
              </Typography>
              <Typography className="profileText">The Monkey</Typography>
              <Typography className="profileText">goyalyash1211@gmail.com</Typography>
              <Typography className="profileText"> PHONE NUMBER</Typography>
              <Typography className="profileText">Male</Typography>
            </div>

            <Link to="/profile/update" style={{ textDecoration: "none" }}>
              <Button variant="contained" className="profileButton">
                EDIT DETAILS
              </Button>
            </Link>
            <div className="detials">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
                style={{ marginTop: "1.5rem" }}
              >
                LOGIN DETAILS
              </Typography>
              <Typography className="profileSubHeading">EMAIL</Typography>
              <Typography className="profileText">goyalyash1211@gmail.com</Typography>

              <Typography
                className="profileSubHeading"
                style={{ marginTop: "10px" }}
              >
                PASSWORD
              </Typography>
              <Typography className="profileSubHeading">
                *************
              </Typography>
            </div>
            <Link
              to="/password/update"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" className="profileButton">
                UPDATE PASSWORD
              </Button>
            </Link>

            <div className="mangeAccount">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
              >
                Log out from all devices
              </Typography>

              <p className="profileText3">
                To access the Cricket Weapon Store website again, you need to
                provide your credentials. This action will log you out from any
                other web browsers you have used before.
              </p>
            </div>
            <Button
              variant="contained"
              color="primary"
              className="profileButton"
              startIcon={<LogoutIcon />}
              
            >
              Logout Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
