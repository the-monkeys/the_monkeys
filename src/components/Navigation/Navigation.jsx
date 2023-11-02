import React, { useRef, useState } from "react";
import MenuBtn from "../../assets/menu_icon.png";
import { Logo } from "../Logo";
import {
  AiFillCloseSquare,
  // AiOutlineDown,
  AiOutlineSearch,
} from "react-icons/ai";
import {TfiWrite} from 'react-icons/tfi'
// import { FaPenToSquare } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "izitoast-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useOutsideClickEditor from "./Toggle/useOutsideClickEdit";
import useOutsideClickProfile from "./Toggle/useOutsideClickProf";
import UserService from "../../utils/UserService";
import { useEffect } from "react";
import { logoutUser } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
// import { HiUserCircle } from "react-icons/hi2";
import { HeaderData } from "../../utils/HeaderData";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";

export const Navigation = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [isEditorMenu, setIsEditorMenu] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isMobMenu, setIsMobMenu] = useState(false);
  const [name, setName] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [activeStatus, setActiveStatus] = useState(1);

  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);

  const data = useSelector((store) => store.auth.data);

  const dispatch = useDispatch();

  const ref = useRef();
  const ref1 = useRef();

  // const toggleTheme = (e) => {
  //   if (e.target.checked)
  //     setTheme("business")
  //   else
  //     setTheme("light")

  // };

  useOutsideClickEditor(ref, () => {
    setIsEditorMenu(false);
  });

  useOutsideClickProfile(ref1, () => {
    setIsProfile(false);
  });

  const successAlert = useToast({
    title: "Successfully Logout",
    titleColor: "green",
    color: "green",
    icon: "ico-success",
    position: "topCenter",
    timeout: 0.2,
  });

  const loadData = async () => {
    const response = await UserService.getOne(data.userId);
    debugger;
    setName(response.data.firstName);
    setImgData(
      `https://themonkeys.tech/api/v1/files/profile/${data.userId}/profile`
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [data.userId]);

  const navigate = useNavigate();

  const Login = () => {
    navigate("/login");
    setIsProfile(false);
  };

  const Register = () => {
    navigate("/register");
    setIsProfile(false);
  };

  const Logout = () => {
    dispatch(logoutUser());
    navigate("/");
    successAlert();
    setImgData(null);
    setName("User");
  };

  return (
    <>
      {/* Desktop */}
      <div
        className={`md:flex items-center justify-between hidden w-full h-12 bg-[#f2f1ee]`}
      >
        <div className="relative flex items-center justify-center gap-12 ml-4">
          <AiOutlineMenu
            id="menu"
            onClick={() => {
              setIsMenu(!isMenu);
            }}
            className={`w-full cursor-pointer h-6 text-[#333030]`}
          />

          {isAuthenticated && (
            <motion.div
              whileTap={{ scale: 0.75 }}
              className={`md:flex items-center gap-1 text-[#333030] cursor-pointer hidden`}
              // onClick={() => setIsEditorMenu(!isEditorMenu)}
              onClick={()=> navigate('/write')}
              ref={ref}
            >
              <p className={`text-[#333030]`}>Write</p>
              <TfiWrite style={{ fontSize: '15px' }}/>
              {/* <AiOutlineDown /> */}
            </motion.div>
          )}
        </div>
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            isAuthenticated ? "-ml-[-40px]" : "ml-[150px]"
          } `}
        >
          <input
            placeholder="Search Blogs..."
            className={`h-[26px] w-375 rounded-full p-4 text-base ml-8 outline-none shadow-md bg-white`}
            type="text"
          />
          <button className="searchbtn h-[29px] w-[29px] rounded-full text-white bg-[#333030] text-2xl -ml-10 flex items-center justify-center">
            <AiOutlineSearch className={`text-lg text-[#eee] `} />
          </button>
        </div>

        <div className="relative">
          <div className="drop-shadow-lg cursor-pointer" ref={ref1}>
            <motion.div
              whileTap={{ scale: 0.75 }}
              onClick={() => setIsProfile(!isProfile)}
              className="flex items-center justify-center rounded-2xl w-48 h-12 cursor-pointer gap-2"
            >
              {imgData != null ? (
                <img src={imgData} className="h-8 w-8 rounded-full" alt="" />
              ) : (
                <FaUserCircle className={`text-3xl mr-1 text-[#333030]`} />
              )}
              {console.log(isAuthenticated, "isAuthenticated")}
              {isAuthenticated ? (
                <p className={`text-[#333030]`}>Hello, {name}</p>
              ) : (
                <p className={`text-[#333030]`}>Hello, User</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* <div className="flex-none -ml-[310px]">
          <label className="swap swap-rotate items-center">
            <input type="checkbox" onChange={toggleTheme} checked={theme == "light" ? false : true} />
            <svg className="swap-on fill-current w-8 h-8 text-[#ff462e]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
            <svg className="swap-off fill-current w-8 h-8 text-[#333030]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
          </label>
        </div> */}
      </div>
      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-12 bg-[#F2F1EE]">
        <div className="relative flex items-center justify-center">
          <img
            onClick={() => {
              setIsMenu(!isMenu);
            }}
            id="menu"
            className="w-full cursor-pointer h-8 ml-2"
            src={MenuBtn}
            alt="menu btn"
          />
        </div>
        <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
          <Logo />
        </Link>

        <div className="relative">
          {imgData != null ? (
            <img src={imgData} className="h-8 w-8 rounded-full" alt="" />
          ) : (
            <FaUserCircle
              className={`text-3xl mr-1 text-[#333030] w-8 min-w-8 min-h-8 h-8 drop-shadow-lg cursor-pointer rounded-[50%]`}
              onClick={() => {
                setIsMobMenu(!isMobMenu);
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated ? (
        <>
          {isMobMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className=" absolute top-14 right-2 h-44 w-36 bg-[#f2f1ee] flex flex-col items-center justify-center md:hidden rounded-lg z-10"
            >
              {isAuthenticated && (
                <>
                  <div className="flex items-center justify-start">
                    <p className="font-bold">My Account</p>
                  </div>
                  <div className="flex items-center pt-4">
                    <Link className="cursor-pointer" to={"/profile"}>
                      Profile
                    </Link>
                  </div>
                  <Link
                    className="flex items-center pt-4 cursor-pointer"
                    to={"/settings"}
                  >
                    <p>Settings</p>
                  </Link>
                  <div
                    onClick={Logout}
                    className="flex items-center pt-4 cursor-pointer"
                  >
                    <p>Logout</p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </>
      ) : (
        ""
      )}
      {/* Desktop Menu */}
      <div>
        <div
          className={`md:flex justify-center items-center h-28 hidden  bg-[#fffbfa]`}
        >
          <Logo />
        </div>
        <div
          className={`md:flex justify-between xl:justify-evenly items-center xl:w-full xl:mx-0 h-12 sm:block bg-[#F2F1EE] overflow-x-scroll scrollbar-hide hidden`}
        >
          <ul className="flex xl:ml-0 md:ml-8">
            {HeaderData.map((item) => (
              <li
                onClick={() => setActiveStatus(item.id)}
                className={
                  activeStatus === item.id
                    ? "text-sm border-[#ff462e] pt-3 rounded-t text-[#ff462e] mr-12"
                    : "text-sm text-gray-600 py-3 flex items-center mr-12 hover:text-[#ff462e] cursor-pointer"
                }
              >
                <div className="flex items-center mb-3">
                  <span className="ml-1 font-normal">
                    {activeStatus === item.id ? item.name : item.name}
                  </span>
                </div>
                {activeStatus === item.id && (
                  <div className="w-full h-1 bg-[#ff462e] rounded-t-md" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Editor */}
        {isEditorMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute top-14 rounded-lg md:left-[40px] flex justify-center items-center flex-col shadow-md w-48 px-2 gap-1 bg-[#f2f1ee]"
          >
            <div
              onClick={() => setIsEditorMenu(!isEditorMenu)}
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px] border-[#1f1f1f]"
            >
              <BsPencilSquare className="py-2 text-4xl" />
              <Link to={"/write/" + uuidv4()} key={uuidv4()}>
                Editor JS
              </Link>
            </div>
            <div
              onClick={() => setIsEditorMenu(!isEditorMenu)}
              className="cursor-pointer flex items-center justify-start w-full"
            >
              <BsPencilSquare className="py-2 text-4xl" />
              <Link to={"/type/" + uuidv4()} key={uuidv4()}>
                {/* Quill Editor */}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Menu */}
        {isMenu && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className={`fixed top-0 left-0 bg-opacity-90 w-full h-screen bg-white drop-shadow-md flex flex-col z-[101] overflow-y-scroll scrollbar-hide`}
          >
            <div className="w-full flex items-center justify-between p-4 cursor-pointer">
              <div></div>
              <motion.div whileTap={{ scale: 0.75 }}>
                <div className="ml-8">
                  <Logo />
                </div>
              </motion.div>

              <motion.p
                whileTap={{ scale: 0.75 }}
                className="flex items-center gap-2 p-1 px-2 my-2 rounded-md cursor-pointer text-textColor text-base"
                onClick={() => setIsMenu(!isMenu)}
              >
                <AiFillCloseSquare className="text-2xl text-[#ff462e]" />
              </motion.p>
            </div>
            <div className="w-full flex flex-col justify-self-stretch items-center text- font-sans text-lg border-1 mt-[4%] text-offWhite">
              <div className="w-[75%] md:w-72 flex flex-col items-center justify-center gap-8">
                <input
                  type="text"
                  className="w-full mx-4 rounded-lg px-[4px] border-solid border-[1.5px] border-
                  Black text-lightBlack flex md:hidden items-center justify-between"
                  placeholder="Search"
                />
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                >
                  Trending
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Technology
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Business
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Philosophy
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Lifestyle
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Health
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                >
                  Opinion
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                >
                  Sports
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Cuisine
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md"
                  to="/"
                >
                  Travel
                </button>
                <button
                  onClick={() => {
                    setIsMenu(false);
                    navigate("/");
                  }}
                  className="cursor-pointer flex items-center justify-center h-10 w-full bg-[#ff462e] rounded-md mb-24"
                >
                  Humor
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile */}
        {isProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute top-14 right-2 w-[255px] flex items-center justify-center rounded-lg shadow-md bg-[#f2f1ee] p-4 flex-col"
          >
            <div
              className={`flex items-center justify-center py-4 border-gray-300 ${
                isAuthenticated ? "border-b-[1px] hidden" : ""
              }`}
            >
              <button
                onClick={Login}
                className="bg-[#ff462e] w-24 h-12 rounded-full mr-2 text-white font-sans text-2xl"
              >
                Login
              </button>
              <p>or</p>
              <button
                onClick={Register}
                className="border-2 border-black w-24 h-12 rounded-full ml-2 font-sans text-2xl"
              >
                Signup
              </button>
            </div>
            {isAuthenticated && (
              <>
                <div className="flex items-center justify-start pt-4">
                  <p className="font-bold">My Account</p>
                </div>
                <div className="flex items-center pt-4">
                  <Link className="cursor-pointer" to={"/profile"}>
                    Profile
                  </Link>
                </div>
                <Link
                  className="flex items-center pt-4 cursor-pointer"
                  to={"/settings"}
                >
                  <p>Settings</p>
                </Link>
                <div
                  onClick={Logout}
                  className="flex items-center pt-4 cursor-pointer"
                >
                  <p>Logout</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};
