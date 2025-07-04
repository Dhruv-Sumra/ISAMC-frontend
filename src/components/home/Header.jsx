import { NavLink, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, Settings, Sun, Moon, Shield } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "/src/assets/logo3.png";
import { motion } from "framer-motion";
import ProfileIcon from "./ProfileIcon";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";
import LiquidGlassToggle from "../ui/LiquidGlassToggle";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About us" },
  { path: "/membership", label: "Membership" },
  { path: "/events", label: "Events" },
  { path: "/publications", label: "Publications" },
  { path: "/resources", label: "Resources" },
  // { path: "/gujarat-map", label: "Gujarat Map" },
  { path: "/contact", label: "Contact us" },
];

// Admin email - replace with your actual email
const ADMIN_EMAIL = "your-email@example.com"; // Replace this with your actual email

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Function to check if current user is admin
  const isAdmin = () => {
    return user?.email === ADMIN_EMAIL;
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
  
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  useEffect(() => {

    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsProfileMenuOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColorClass =
    isScrolled || location.pathname !== "/"
      ? "text-black dark:text-white"
      : "text-white";

  const userColorClass =
    isScrolled || location.pathname !== "/"
      ? "text-blue "
      : "text-white ";

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `links_border ${
              isMobile ? "block w-full " : "text-lg"
            } ${
              isActive
                ? "text-blue-500 font-semibold"
                : isMobile
                ? "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                : isScrolled
                ? "text-black dark:text-white hover:text-amber-900 dark:hover:text-blue-300"
                : "hover:text-amber-900 dark:hover:text-blue-300"
            }`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );

  const renderAuthSection = (isMobile = false) => {
    if (!isAuthenticated || location.pathname === "/verify-email") {
      return (
        <Link
          to="/login"
          className={`text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 ${
            isMobile ? "w-full text-center" : "text-sm"
          }`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          Login
        </Link>
      );
    }

    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 px-2 py-2">
            <ProfileIcon username={user?.name || user?.email} />
            <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
              {user?.name || user?.email}
            </span>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 px-2 py-2 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} /> Profile
          </Link>
          <Link
            to="/profile/edit"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 px-2 py-2 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} /> Edit Profile
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 px-2 py-2 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Shield size={16} /> Admin Panel
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 px-2 py-2 transition-colors w-full text-left"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      );
    }

    return (
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={toggleProfileMenu}
          className={`flex items-center space-x-2 focus:outline-none cursor-pointer p-2 rounded-full transition-colors duration-300 `}
        >
          <ProfileIcon username={user?.name || user?.email} />
          <span className={`text-sm ${textColorClass} font-medium hidden sm:block`}>
            {user?.name || "User"}
          </span>
          <img
            className={`h-4 w-4 transition-transform duration-300 ${
              isProfileMenuOpen ? "rotate-180" : "rotate-0"
            }`}
            src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3250959/caret-down-icon-md.png"
            alt="down-arrow"
          />
        </button>

        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute  right-0 top-full mt-2 w-48 bg-blue-50 rounded-md shadow-lg py-1 z-50"
          >
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
            <Link
              to="/profile/edit"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-blue-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all ${
        isScrolled ? "bg-gray-200 shadow-md dark:bg-slate-900 " : "bg-transparent"
      }`}
    >
      <div className="px-3 sm:px-5 md:px-10 min-w-0 flex items-center h-16 md:h-20 justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <a href="/" aria-label="Go to homepage">
            <img
              src={logo}
              alt="ISAMC Logo"
              className="object-contain w-32 h-14 sm:w-40 sm:h-16 md:w-48 md:h-20 transition-all duration-300"
            />
          </a>
        </div>

        {/* Centered Navigation Links */}
        <nav
          className={`hidden md:flex space-x-4 lg:space-x-8 md:text-base lg:text-lg mx-auto ${textColorClass}`}
          aria-label="Main navigation"
        >
          {renderNavLinks()}
        </nav>

        {/* Right Side Section */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
          {renderAuthSection()}
          <LiquidGlassToggle />
          <button
            onClick={() => setDarkMode(darkMode === "dark" ? "light" : "dark")}
            className={`p-2 rounded-full transition-colors duration-300 ${textColorClass} hover:bg-slate-600 dark:hover:bg-slate-600 `}
            aria-label="Toggle dark mode"
          >
            {darkMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden z-50 text-blue-500 cursor-pointer transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu & Backdrop */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu backdrop"
          />
          {/* Mobile Menu */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 right-0 z-50 bg-blue-100 dark:bg-slate-900 w-full max-w-xs h-full shadow-lg md:hidden flex flex-col overflow-y-auto"
            aria-label="Mobile navigation"
          >
            <div className="w-full h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
              <a href="/" aria-label="Go to homepage">
                <img
                  src={logo}
                  alt="ISAMC Logo"
                  className="h-12 object-contain w-32"
                />
              </a>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 flex flex-col">
              {renderNavLinks(true)}
            </div>

            <div className="px-4 py-4 border-t border-gray-300 dark:border-gray-700 flex flex-col gap-4">
              {renderAuthSection(true)}
              <div className="flex items-center space-x-2">
                <LiquidGlassToggle />
                <button
                  onClick={() => setDarkMode(darkMode === "dark" ? "light" : "dark")}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </header>
  );
};

export default Header;
