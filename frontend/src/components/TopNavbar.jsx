import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TopNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/frontdev/projects", label: "Projects" },
    { path: "/frontdev/certificates", label: "Certificates" },
    { path: "/frontdev/blogs", label: "Blogs" },
    { path: "/frontdev/others", label: "Others" },
    { path: "/resume", label: "Resume" }, // tetap ada
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">fatkhurrhn</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsOpen(true)}
            >
              <i className="ri-menu-2-line text-xl"></i>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.slice(0, -1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-gray-600 transition-colors font-medium ${
                    location.pathname === item.path
                      ? "text-gray-600 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Resume Button */}
            <Link
              to="/resume"
              className="text-gray-800 font-medium rounded-lg text-sm px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Resume
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <span className="text-lg font-bold text-gray-800">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <i className="ri-close-line text-2xl text-gray-600"></i>
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium ${
                location.pathname === item.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TopNavbar;
