import React, { useRef, useState } from "react";
import MenuBtn from "../../assets/menu_icon.png";
import { Logo } from "../Logo";
import { AiFillCloseSquare, AiOutlineSearch } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useOutsideClickEditor from "./Toggle/useOutsideClickEdit";
import useOutsideClickProfile from "./Toggle/useOutsideClickProf";
import UserService from "../../utils/UserService";
import { useEffect } from "react";
import { logoutUser } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { HeaderData } from "../../utils/HeaderData";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import toast from "react-hot-toast";

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
  const ref2 = useRef();
  useOutsideClickEditor(ref, () => {
    setIsEditorMenu(false);
  });

  useOutsideClickProfile(ref1, () => {
    setIsProfile(false);
  });
  useOutsideClickProfile(ref2, () => {
    setIsMobMenu(false);
  });

  const loadData = async () => {
    const response = await UserService.getOne(data.userId);
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
    toast.success("Successfully Logout");
    setImgData(null);
    setName("User");
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 760);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Desktop */}
      <div
        className={`md:flex items-center justify-between hidden w-full h-12 bg-[#f2f1ee]`}
      >
        <div className="relative flex items-center justify-center gap-12 ml-4">
          {isMobile && (
            <AiOutlineMenu
              id="menu"
              onClick={() => {
                setIsMenu(!isMenu);
              }}
              className={`w-full cursor-pointer h-6 text-[#333030]`}
            />
          )}

          {isAuthenticated && (
            <motion.div
              whileTap={{ scale: 0.75 }}
              className={`md:flex items-center gap-1 text-[#333030] cursor-pointer hidden`}
              // onClick={() => setIsEditorMenu(!isEditorMenu)}
              onClick={() => navigate("/write")}
              ref={ref}
            >
              <p className={`text-[#333030]`}>Write</p>
              <TfiWrite style={{ fontSize: "15px" }} />
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
              {/* for time being Adding a random image will revert it once api will give proper img  */}
              {imgData != null ? (
                <img
                  src={imgData ? "favicons/apple-touch-icon.png" : imgData}
                  className="h-8 w-8 rounded-full"
                  alt=""
                />
              ) : (
                <FaUserCircle className={`text-3xl mr-1 text-[#333030]`} />
              )}

              {isAuthenticated ? (
                <p className={`text-[#333030]`}>Hello, {name}</p>
              ) : (
                <p className={`text-[#333030]`}>Hello, User</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-12 bg-[#F2F1EE]" >

        <motion.div
          className="flex items-center gap-2 cursor-pointer mx-auto"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          
        >
          <Link to={"/"}>
            <Logo />
          </Link>
        </motion.div>
        
        <div className="relative">
          <div className="drop-shadow-lg cursor-pointer" ref={ref2}>
              <motion.div
              whileTap={{ scale: 0.75 }}
              onClick={() => setIsMobMenu(!isMobMenu)}
              className="rounded-2xl mr-4 cursor-pointer"
              > 
                {imgData != null ? (
                  <img
                    src={imgData ? "favicons/apple-touch-icon.png" : imgData}
                    className="h-8 w-8 rounded-full"
                    alt=""
                  />
                ) : (
                  <FaUserCircle className={`text-3xl mr-1 text-[#333030]`} />
                )}
              </motion.div>
          </div>
        </div>
        
      </div>

      {/* Mobile Menu */}
      <>
        {isMobMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className=" absolute top-14 right-2 h-48 w-36 bg-[#f2f1ee] flex flex-col items-center justify-center md:hidden rounded-lg z-10"
          >
            <div
              className={`flex flex-col justify-center items-center py-4 border-gray-300 ${
                isAuthenticated ? "border-b-[1px] hidden" : ""
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgb(57 57 58)" }}
                onClick={Login}
                className="bg-[#ff462e] w-20 h-10 rounded-full mb-2 text-white font-sans text-xxl md:text-xl"
              >
                Login
              </motion.button>
              <p className="mb-2 text-sm md:text-base">or</p>
              <motion.button
                whileHover={{ scale: 1.1, borderColor: "#ff462e" }}
                onClick={Register}
                className="border-2 border-black w-20 h-10 rounded-full mt-2 font-sans text-xxl md:text-xl"
              >
                Signup
              </motion.button>
            </div>
            {isAuthenticated && (
              <>
              <motion.div
                className="flex items-center justify-start pt-2"
              >
                <p className="font-bold">My Account</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                className="flex items-center pt-4"
              >
                <Link className="cursor-pointer" to={"/profile"}>
                  Profile
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                className="flex items-center pt-4 cursor-pointer"
              >
                <Link to={"/settings"}>
                  <p>Settings</p>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                onClick={Logout}
                className="flex items-center pt-4 cursor-pointer"
              >
                <p>Logout</p>
              </motion.div>
            </>
            )}
          </motion.div>
        )}
      </>
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
          <ul className="flex xl:ml-0 md:ml-8 gap-12 items-center">
            {HeaderData.map((item) => (
              <li
                onClick={() => setActiveStatus(item.id)}
                className={
                  activeStatus === item.id
                    ? "text-sm border-[#ff462e] pt-3 rounded-t items-center text-[#ff462e] "
                    : "text-sm text-gray-600 pt-3 flex items-center  hover:text-[#ff462e] cursor-pointer"
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
                Quill Editor
              </Link>
            </div>
          </motion.div>
        )}

 
        {/* Profile */}
        {isProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute top-10 right-2 w-[255px] flex items-center justify-center rounded-lg shadow-md bg-[#f2f1ee] p-4 flex-col"
          >
            <div
              className={`flex items-center justify-center py-4 border-gray-300 ${
                isAuthenticated ? "border-b-[1px] hidden" : ""
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgb(57 57 58)" }}
                onClick={Login}
                className="bg-[#ff462e] w-24 h-12 rounded-full mr-2 text-white text-xl"
              >
                Login
              </motion.button>
              <p>or</p>
              <motion.button
                whileHover={{ scale: 1.1, borderColor: "#ff462e" }}
                onClick={Register}
                className="border-2 border-black w-24 h-12 rounded-full ml-2 text-xl"
              >
                Signup
              </motion.button>
            </div>
            {isAuthenticated && (
              <>
                <motion.div
                  className="flex items-center justify-start pt-4"
                >
                  <p className="font-bold">My Account</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                  className="flex items-center pt-4"
                >
                  <Link className="cursor-pointer" to={"/profile"}>
                    Profile
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                  className="flex items-center pt-4 cursor-pointer"
                >
                  <Link to={"/settings"}>
                    <p>Settings</p>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 ,color: "#ff462e"}}
                  onClick={Logout}
                  className="flex items-center pt-4 cursor-pointer"
                >
                  <p>Logout</p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

      </div>
    </>
  );
};
