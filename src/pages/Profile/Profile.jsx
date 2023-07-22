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

export const Profile = () => {
  const [loadData, setloadData] = useState([])
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [imgData, setImgData] = useState(null);

  const data = useSelector((store)=>store.auth.data);

  const loadingData = async () => {
    const response = await UserService.getOne(data.userId);
    setloadData(response.data);
    setImgData(`https://themonkeys.tech/api/v1/files/profile/${data.userId}/profile`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadingData();
    }
  }, []);

  return (
    <>
      <div className="md:mt-16 mt-8 flex items-center justify-center">
        <div className="w-[95%] md:w-[55%] m-auto rounded-3xl overflow-hidden shadow-md">
          <img
            className="w-full md:h-48 h-28"
            src={ImgBg}
            alt="Sunset in the mountains"
          />
          <div className="flex justify-center items-center flex-col w-300">
            <div className="px-6 py-4">
              <div className="w-full px-4 lg:order-2 flex justify-center">
                <div className="relative">
                {
                imgData != null ? <img src={imgData} className="h-28 w-36 shadow-xl text-8xl rounded-full md:-mt-20 -mt-16 -ml-8" alt="" /> :
                  <HiUserCircle className="shadow-xl md:text-9xl text-8xl rounded-full md:-mt-20 -mt-16 bg-white text-[#27282b]" />
              }
                </div>
              </div>
              {isAuthenticated ? <p className="text-gray-700 text-4xl font-bold font-sans pt-8">
                {loadData.firstName + " " + loadData.lastName}
              </p> : <p className="text-gray-700 text-4xl text-center font-bold font-sans pt-8">
                User
              </p>}
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Software Developer
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Web Designer
              </span>
              <div className="text-base leading-normal mt-0 mb-2 text-gray-500 font-semibold">
                <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                Los Angeles, California, Unitedstate Of America
              </div>
              <div className="text-base leading-normal mt-0 mb-2 text-gray-500 font-semibold">
                <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                480 connections
              </div>
            </div>

            <div className="px-6 pt-4 pb-2 flex items-center">
              <div className="mr-4 p-4 text-center">
                <AiFillTwitterCircle className="cursor-pointer text-[26px] text-[#27282b]" />
                <p className="text-base leading-normal mt-0 mb-2 text-gray-500 font-bold">
                  480
                </p>
              </div>
              <div className="mr-4 p-3 text-center">
                <AiFillInstagram className="cursor-pointer text-[26px] text-[#27282b]" />
                <p className="text-base leading-normal mt-0 mb-2 text-gray-500 font-bold">
                  480
                </p>
              </div>
              <div className="mr-4 p-3 text-center">
                <BsPinterest className="cursor-pointer text-[26px] text-[#27282b]" />
                <p className="text-base leading-normal mt-0 mb-2 text-gray-500 font-bold">
                  480
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[95%] md:w-[55%] m-auto mt-12 rounded-3xl shadow-md border">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Skills</div>
        </div>
        <div className="px-6 pb-2 flex-wrap">
          <span className="inline-block border-2 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            devOops
          </span>
          <span className="inline-block border-2 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Microsoft Dynamic 365 Finance and Operation
          </span>
          <span className="inline-block border-2 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Python
          </span>
        </div>
      </div>

      <div className="w-[95%] md:w-[55%] m-auto mt-12 rounded-3xl shadow-md border">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Software Skill</div>
        </div>
        <div className="px-6 pb-2 md:flex flex-wrap items-center">
          <div className="p-4">
            <SiAdobeillustrator className="cursor-pointer text-[26px] rounded-xl text-[#310000] bg-[#F79500]" />
          </div>
          <div className="p-3 text-center">
            <SiAdobeindesign className="cursor-pointer text-[26px] rounded-xl text-[#47021E] bg-[#F73163]" />
          </div>
          <div className="p-3 text-center">
            <SiAdobephotoshop className="cursor-pointer text-[26px] rounded-xl text-[#001D34] bg-[#2FA3F7]" />
          </div>
          <div className="p-3 text-center">
            <SiAdobexd className="cursor-pointer text-[26px] rounded-xl text-[#450135] bg-[#F75EEE]" />
          </div>
          <div className="p-3 text-center">
            <SiAdobeaftereffects className="cursor-pointer text-[26px] rounded-xl text-[#000058] bg-[#9494F7]" />
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </>
  );
};
