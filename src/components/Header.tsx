"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Zap,
  Globe,
  BookOpen,
  Menu,
  X,
  PieChart,
  BarChart3,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // FIX: Prefixed setUser with an underscore
  const [user, _setUser] = useState<{ username: string } | null>(null);
  const notifications = 3;
  const router = useRouter();

  // Track window width for responsiveness
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    // Example: You might fetch user data here and use _setUser
    // For now, _setUser is unused, but this is where you'd call it:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   // Imagine fetchUser(token) returns { username: 'JohnDoe' }
    //   fetchUser(token).then(userData => _setUser(userData));
    // }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Removed _setUser from dependency array if it's not used to set state in this effect

  return (
    <motion.header className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
      {/* Left Navigation */}
      <div className="flex items-center space-x-4 md:space-x-8">
        <motion.span
          onClick={() => router.push("/")}
          className="text-xl md:text-2xl font-bold text-blue-500 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="text-blue-500 font-semibold flex items-center"
              >
                <Zap className="mr-1" size={windowWidth < 768 ? 20 : 16} />{" "}
                Explore
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <Globe className="mr-1" size={windowWidth < 768 ? 20 : 16} />{" "}
                Investments
              </a>
            </li>
            <li>
              <a
                href="/dataanalytics"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <PieChart className="mr-1" size={windowWidth < 768 ? 20 : 16} />{" "}
                Analytics
              </a>
            </li>
            <li>
              <a
                href="/candlestick-chart"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BarChart3
                  className="mr-1"
                  size={windowWidth < 768 ? 20 : 16}
                />{" "}
                Candlestick Patterns
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BookOpen className="mr-1" size={windowWidth < 768 ? 20 : 16} />{" "}
                Learn
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Navigation (Search & User Actions) */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="What are you looking for today?"
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notifications */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="text-gray-300 hover:text-blue-500 transition-colors" />
          {notifications > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.div>

        {/* Shopping Cart & User Login */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>

        {user ? (
          <span className="text-gray-300">Welcome, {user.username}</span>
        ) : (
          <motion.button
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded transition"
            onClick={() => router.push("/login")}
          >
            Login
          </motion.button>
        )}

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 p-4 z-50"
          >
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X />
            </motion.button>
            {/* Mobile Menu Navigation */}
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="text-blue-500 font-semibold flex items-center"
                  >
                    <Zap className="mr-2" size={20} /> Explore
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <Globe className="mr-2" size={20} /> Investments
                  </a>
                </li>
                <li>
                  <a
                    href="/dataanalytics"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <PieChart className="mr-2" size={20} /> Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/candlestick-chart"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BarChart3 className="mr-2" size={20} /> Candlestick
                    Patterns
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BookOpen className="mr-2" size={20} /> Learn
                  </a>
                </li>
                {/* Example: Mobile Login/User Info */}
                <li className="pt-4 border-t border-gray-700">
                  {user ? (
                    <span className="text-gray-300 flex items-center">
                      <User className="mr-2" size={20} /> Welcome,{" "}
                      {user.username}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMenuOpen(false); // Close menu on navigation
                      }}
                      className="text-blue-500 hover:text-blue-400 font-semibold flex items-center w-full"
                    >
                      <User className="mr-2" size={20} /> Login / Sign Up
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
