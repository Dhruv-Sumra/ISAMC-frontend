import React from "react";
import logo2 from '../../assets/logo2.png'; // Adjust the path as needed
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="px-5 md:px-15 py-5 bg-blue-200 text-black w-full mt-10 h-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-3">
          <div className="flex flex-start space-x-2 items-center">
            <a href="/">
              <img className="h-10" src={logo2} alt="logo" />
            </a>
            <h2 className="text-2xl font-bold">ISAMC
              <div className="border-2 border-blue-500 w-2/3"></div>
            </h2>
          </div>

          <p>
            Indian Society of Additive Manufacturing and Characterization -
            Advancing the science and technology of additive manufacturing in
            India.
          </p>

          <div className="flex flex-start space-x-5 text-3xl text-blue-500 ">
            <a href="#">
              <i className="fa-brands fa-instagram hover:text-blue-600 hover:scale-110 transi"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook-f hover:text-blue-600 hover:scale-110 transi"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-twitter hover:text-blue-600 hover:scale-110 transi "></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in hover:text-blue-600 hover:scale-110 transi"></i>
            </a>
          </div>
        </div>

        <div className="md:px-10">
          <h2 className="text-2xl font-bold">Quick Links
            <div className="border-2 border-blue-500 w-1/3"></div>
          </h2>

          <div className="flex flex-col px-3 text-blue-500 font-medium space-y-1 mt-3">
            <NavLink to="/" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              About us
            </NavLink>
            <NavLink to="/membership" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Membership
            </NavLink>
            <NavLink to="/events" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Events
            </NavLink>
            <NavLink to="/publications" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Publications
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Resources
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) =>
          `${isActive ? "text-blue-500" : "text-blue-600"} block hover:text-blue-600`}>
              Contact us
            </NavLink>

          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-start space-x-2 items-center">
            <h2 className="text-2xl font-bold">Contact us
              <div className="border-2 border-blue-500 w-2/3"></div>
            </h2>
          </div>

          <div className="pr-3 font-medium space-y-3">
            <div className="flex items-start">
              <i className="text-blue-500 fa-solid fa-location-dot mt-1"></i>
              <p className="ml-3">
                Flat No. 204, Floor No. 2, Herbelia, Manpada, Herbelia CHSL, ACME, Ozone, G. A. Road, Thane (W), Thane-400610. 
              </p>
            </div>

            <div className="flex items-center">
              <i className="text-blue-500 fa-solid fa-envelope"></i>
              <a href="mailto:info@isamc.com" className="ml-3 hover:text-blue-600">
                info@isamc.com
              </a>
            </div>
{/* 
            <div className="flex items-center">
              <i className="text-blue-500 fa-solid fa-phone"></i>
              <p className="ml-3">+91 11 2659 7135</p>
            </div> */}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-start space-x-2 items-center">
            <h2 className="text-2xl font-bold">Newsletter
              <div className="border-2 border-blue-500 w-2/3"></div>
            </h2>
          </div>

          <p>
            Subscribe to our newsletter to receive updates on events,
            publications, and industry news.
          </p>

          <input
            type="text"
            placeholder="enter you email"
            className="bg-white px-3 py-1 rounded-sm"
          />
          <br />
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 cursor-pointer px-3 rounded-lg md:text-lg">
            Subscribe
          </button>
        </div>
      </div>
      <div className="mt-5 md:flex justify-between">
        <p className="font-semibold hidden md:block">
          © 2025 Indian Society of Additive Manufacturing and Characterization.
          All rights reserved
        </p>

        <div className="space-x-5">
          <a
            className="text-lg font-semibold text-blue-500 hover:text-blue-600 cursor-pointer "
            href="#"
          >
            Privacy policy
          </a>
          <a
            className="text-lg font-semibold text-blue-500 hover:text-blue-600 cursor-pointer "
            href="#"
          >
            Terms of use
          </a>
        </div>

        <p className="text-sm md:text-semibold md:hidden mt-2">
          © 2025 Indian Society of Additive Manufacturing and Characterization.
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
