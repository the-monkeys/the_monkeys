import React from "react";
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
  SiFigma,
} from "react-icons/si";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export const Profile = () => {
  let dispatch = useDispatch()

  console.log(dispatch, "/sfsd  ");

  return (
    <>
      <div className="mt-24 flex items-center justify-center">
        <div className="w-[55%] m-auto rounded-3xl overflow-hidden shadow-md">
          <img
            className="w-full h-96"
            src={ImgBg}
            alt="Sunset in the mountains"
          />
          <div className="flex justify-center items-center flex-col w-300">
            <div className="px-6 py-4">
              <div className="w-full px-4 lg:order-2 flex justify-center">
                <div className="relative">
                  <HiUserCircle className="shadow-xl text-9xl rounded-full -mt-20 bg-white text-[#27282b]" />
                </div>
              </div>
              <p className="text-gray-700 text-4xl font-bold font-sans pt-8">
                Aritra Das Chowdhury
              </p>
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

      <div className="w-[55%] m-auto mt-12 rounded-3xl shadow-md border">
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

      <div className="w-[55%] m-auto mt-12 rounded-3xl shadow-md border">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Software Skill</div>
        </div>
        <div className="px-6 pb-2 flex items-center">
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
