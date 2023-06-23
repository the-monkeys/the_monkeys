import React, { useEffect, useRef, useState } from "react";
import MenuBtn from "../../assets/menu_icon.png";
import { Logo } from "../Logo";
import { AiOutlineDown, AiOutlineSearch } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "izitoast-react";

const Nav2 = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [isEditorMenu, setIsEditorMenu] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const successAlert = useToast({
    title: "Successfully Logout",
    titleColor: "green",
    color: "green",
    icon: "ico-success",
    position: "topCenter",
  });

  let menuRef = useRef();

  useEffect(()=>{
    let handler = (e) => {
      if(!menuRef.current.contains(e.target)){
        setIsEditorMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
  })

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
    localStorage.clear();
    navigate("/");
    successAlert();
    console.log();
  };

  return (
    <>
      {/* Desktop */}
      <div className="w-full bg-[#F6F6F6] h-12 md:flex justify-center hidden">
        <div className="w-[68%] flex justify-between items-center gap-12">
          <div id="cont" className="top-[9.5px] w-8 ml-4 flex gap-10">
            <img
              onClick={() => {
                setIsMenu(!isMenu);
              }}
              id="menu"
              className="w-full cursor-pointer"
              src={MenuBtn}
              alt="menu btn"
            />
            <div
              className="md:flex items-center gap-1 text-[#333030] cursor-pointer hidden"
              onClick={() => setIsEditorMenu(!isEditorMenu)} ref={menuRef}
            >
              <p className="text-[#333030]">Editor</p>
              <AiOutlineDown />
            </div>
          </div>
          <div className="flex items-start justify-center">
            <input
              placeholder="Search Blogs..."
              className="h-[26px] w-375 rounded-full p-4 text-2xl ml-8 outline-none text-[#333030] border-solid border-[1.5px] border-lightBlack"
              type="text"
            />
            <button className="searchbtn absolute mt-[5px] md:left-[865px] h-[23px] w-[23px] rounded-full  flex items-center justify-center text-white text-2xl">
              <AiOutlineSearch />
            </button>
          </div>
          <div
            onClick={() => setIsProfile(!isProfile)}
            className="flex items-center justify-center rounded-2xl w-48 h-12 cursor-pointer gap-2"
          >
            <FaUserCircle className="text-4xl text-[#333030]" />
            <p className="flex flex-row">Hello, Login</p>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-12 bg-[#F2F1EE]">
        <div className="relative flex items-center justify-center">
          <img
            onClick={() => {
              setIsMenu(!isMenu);
            }}
            id="menu"
            className="w-full cursor-pointer h-8"
            src={MenuBtn}
            alt="menu btn"
          />
        </div>
        <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
          <Logo />
        </Link>

        <div className="relative">
          <AiOutlineSearch
            className="w-8 min-w-8 min-h-8 h-8 drop-shadow-lg cursor-pointer rounded-[50%]"
            onClick={() => {
              setIsSearch(!isSearch);
            }}
          />
        </div>
      </div>
      {isSearch && (
        <div className="h-8 w-full bg-[#F2F1EE] flex items-center justify-center md:hidden">
          <input
            type="text"
            className="w-full mx-4 rounded-lg px-[4px] border-solid border-[1.5px] border-lightBlack"
            placeholder="Search"
          />
        </div>
      )}
      <div>
        <div className="md:flex justify-center items-center h-28 hidden bg-[#fffbfa]">
          <Logo />
        </div>
        <div className="md:flex justify-center items-center h-12 bg-[#F2F1EE] hidden">
          <div className="w-full flex justify-self-stretch items-center text-[#333030] font-sans">
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Trending
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Technology
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Business
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Philosophy
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Lifestyle
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Health
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Opinion
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Sports
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Cuisine
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Travel
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-center w-full"
              to="/"
            >
              Humor
            </Link>
          </div>
        </div>
        {isEditorMenu && (
          <div className="absolute top-12 rounded-b-xl md:left-[260px] flex justify-center items-center flex-col shadow-md w-48 px-2 gap-1 bg-[#F1F5F9] border-t-2">
            <div
              onClick={() => setIsEditorMenu(!isEditorMenu)}
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
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
          </div>
        )}

        {isMenu && (
          <div className="absolute md:top-12 text-xl top-12 md:left-[150px] px-4 py-2 bg-[#F1F5F9] md:rounded-b-xl md:shadow-md flex items-center justify-start flex-col h-screen md:h-48">
            <Link
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
              to="/"
            >
              Trending
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
              to="/"
            >
              Technology
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
              to="/"
            >
              Lifestyle
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
              to="/"
            >
              Health
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-start w-full border-b-[1px]"
              to="/"
            >
              Business & Finance
            </Link>
            <Link
              className="cursor-pointer flex items-center justify-start w-full"
              to="/"
            >
              Philosophy & psychology
            </Link>
          </div>
        )}
        {isProfile && (
          <div className="absolute top-12 right-[180px] w-94 flex items-center justify-center rounded-b-2xl shadow-md bg-[#F1F5F9] border-t-2 p-4 flex-col">
            <div
              className={`flex items-center justify-center py-4 border-gray-300 border-b-[1px]`}
            >
              <button
                onClick={Login}
                className="bg-blue-700 w-32 h-16 rounded-full mr-2 text-white font-sans text-2xl"
              >
                Login
              </button>
              <p>or</p>
              <button
                onClick={Register}
                className="border-2 w-32 h-16 rounded-full ml-2 font-sans text-2xl"
              >
                Signup
              </button>
            </div>
            {/* <div className="flex items-center justify-start pt-4">
          <p className="font-bold">My Account</p>
          </div>
          <div className="flex items-center pt-4">
          <Link className="cursor-pointer" to={"/profile"}>Profile</Link>
          </div>
          <div className="flex items-center pt-4 cursor-pointer">
          <p>Settings</p>
          </div>
          <div onClick={Logout} className="flex items-center pt-4 cursor-pointer">
          <p>Logout</p>
          </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Nav2;
