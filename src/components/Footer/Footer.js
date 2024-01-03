import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4 md:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="mb-8 md:mb-0">
        <h2 className="text-lg font-semibold mb-4">Services</h2>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          Branding
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          Design
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          Marketing
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block">
          Advertisement
        </Link>
      </div>

      <div className="mb-8 md:mb-0">
        <h2 className="text-lg font-semibold mb-4">Company</h2>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          About us
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          Contact
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block mb-2">
          Jobs
        </Link>
        <Link to="#" className="text-gray-700 hover:text-gray-900 block">
          Press kit
        </Link>
      </div>

      <div className="mb-8 md:mb-0">
        <h2 className="text-lg font-semibold mb-4">Legal</h2>
        <Link
          to="/termsofuse"
          className="text-gray-700 hover:text-gray-900 block mb-2"
        >
          Terms of use
        </Link>
        <Link
          to="/privacypolicy"
          className="text-gray-700 hover:text-gray-900 block mb-2"
        >
          Privacy Policy
        </Link>
        <Link
          to="/cookiepolicy"
          className="text-gray-700 hover:text-gray-900 block"
        >
          Cookie Policy
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Get Into Contact</h2>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Enter your email address</label>
          <div className="flex flex-col md:flex-row">
            <input
              type="text"
              placeholder="username@site.com"
              className="border rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 w-full md:w-2/3 focus:outline-none"
            />
            <button className="bg-[#ff462e] text-[#fffff] rounded-lg px-6 py-2 hover:bg-red-600 w-full md:w-1/3">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
