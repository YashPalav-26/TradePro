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
  const [user, setUser] = useState<{ username: string } | null>(null); // Keep setUser as is
  const notifications = 3;
  const router = useRouter();

  // State to manage client-side readiness and actual window width
  const [isClient, setIsClient] = useState(false);
  const [currentWindowWidth, setCurrentWindowWidth] = useState(0); // Initialize with 0 or a non-colliding value

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsClient(true);
    setCurrentWindowWidth(window.innerWidth); // Get actual window width

    const handleResize = () => {
      setCurrentWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up

  // Determine icon size:
  // For SSR and initial client render (before isClient is true), use a consistent default.
  // After client mounts, use the actual currentWindowWidth.
  const getDynamicIconSize = () => {
    if (!isClient) {
      // This is the size the server will render with (and client initially).
      // Choose a default that makes sense, e.g., the larger size or a common desktop size.
      // Let's assume desktop (lg screens) would show size 16 initially.
      // Or, if your lg:block means it's hidden on server for small screens, this logic might be simpler.
      // For simplicity here, let's assume server renders as if it's a wider screen.
      return 16; // Or 20, pick one consistent default for SSR
    }
    // Now on client, use the responsive logic
    return currentWindowWidth < 768 ? 20 : 16;
  };

  const desktopIconSize = getDynamicIconSize();
  const mobileIconSize = 20; // Usually fixed for mobile menu

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
                <Zap className="mr-1" size={desktopIconSize} /> Explore
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <Globe className="mr-1" size={desktopIconSize} /> Investments
              </a>
            </li>
            <li>
              <a
                href="/dataanalytics"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <PieChart className="mr-1" size={desktopIconSize} /> Analytics
              </a>
            </li>
            <li>
              <a
                href="/candlestick-chart"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BarChart3 className="mr-1" size={desktopIconSize} />{" "}
                Candlestick Patterns
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BookOpen className="mr-1" size={desktopIconSize} /> Learn
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Navigation (Search & User Actions) */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className="relative w-full max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />{" "}
          {/* Example fixed size */}
          <input
            type="text"
            placeholder="What are you looking for today?"
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell
            className="text-gray-300 hover:text-blue-500 transition-colors"
            size={22}
          />{" "}
          {/* Example fixed size */}
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
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart
            className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors"
            size={22}
          />{" "}
          {/* Example fixed size */}
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
          <User
            className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors"
            size={22}
          />{" "}
          {/* Example fixed size */}
        </motion.div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? (
            <X size={mobileIconSize} />
          ) : (
            <Menu size={mobileIconSize} />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu Panel */}
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
              <X size={mobileIconSize} />
            </motion.button>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="text-blue-500 font-semibold flex items-center"
                  >
                    <Zap className="mr-2" size={mobileIconSize} /> Explore
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <Globe className="mr-2" size={mobileIconSize} /> Investments
                  </a>
                </li>
                <li>
                  <a
                    href="/dataanalytics"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <PieChart className="mr-2" size={mobileIconSize} />{" "}
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/candlestick-chart"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BarChart3 className="mr-2" size={mobileIconSize} />{" "}
                    Candlestick Patterns
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BookOpen className="mr-2" size={mobileIconSize} /> Learn
                  </a>
                </li>
                {/* Mobile Login/User Info (Add if needed, not shown in original where it caused issues) */}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
