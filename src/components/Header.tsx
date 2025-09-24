'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  PieChart,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <button
        className="p-2 rounded-md hover:bg-accent"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    );
  };

  return (
    <motion.header className="flex justify-between items-center p-4 bg-card text-foreground w-full shadow-md">
      <div className="flex items-center space-x-4 md:space-x-8">
        <motion.span
          onClick={() => router.push('/')}
          className="text-xl md:text-2xl font-bold text-primary cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        <nav className="hidden lg:block">
          <ul className="flex space-x-6">
            <li>
              <a
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dataanalytics"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                <PieChart className="mr-1" size={16} /> Analytics
              </a>
            </li>
            <li>
              <a
                href="/candlestick-chart"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                <BarChart3 className="mr-1" size={16} /> Charts
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
        <div className="relative w-full max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-input rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {renderThemeChanger()}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell
            className="text-muted-foreground hover:text-primary transition-colors"
            size={22}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User
            className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
            size={22}
          />
        </motion.div>
      </div>

      <div className="lg:hidden flex items-center">
        {renderThemeChanger()}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-4"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 h-full w-64 bg-card p-4 z-50 shadow-lg"
          >
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
            <nav className="mt-16">
              <ul className="space-y-6">
                <li>
                  <a
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center text-lg"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/dataanalytics"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center text-lg"
                  >
                    <PieChart className="mr-2" size={20} /> Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/candlestick-chart"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center text-lg"
                  >
                    <BarChart3 className="mr-2" size={20} /> Charts
                  </a>
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