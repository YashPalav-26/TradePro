"use client";
import {
  ArrowRight,
  BarChart2,
  Bell,
  Book,
  Globe,
  Menu,
  PieChart,
  Shield,
  TrendingUp,
  X,
  Zap,
  Moon,
  Sun,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const Animatedsection = ({ children }: any) => {
  const ref = useRef(null);
  const isinview = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isinview ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
};

const FeatureBox = ({ icon, title, description, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-card p-6 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center h-full"
    >
      <div className="text-primary mb-4 bg-secondary/60 p-3 rounded-lg border border-border/60">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4 flex-grow text-sm">{description}</p>
      <motion.button
        whileHover={{ x: 3 }}
        className="mt-auto text-foreground bg-accent px-4 py-2 rounded-md border border-transparent hover:border-border transition-all flex items-center text-sm"
      >
        Learn More <ArrowRight className="ml-1" size={16} />
      </motion.button>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-card p-6 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
    >
      <p className="text-muted-foreground mb-4">"{quote}"</p>
      <div>
        <p className="font-medium text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tradingFeatures = [
    {
      icon: <Globe size={28} />,
      title: "Global Markets",
      description:
        "Access a wide range of international markets and trade various assets from a single platform.",
    },
    {
      icon: <Zap size={28} />,
      title: "Real-time Data",
      description:
        "Stay informed with lightning-fast, real-time market data and instant trade execution.",
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Trading",
      description:
        "Trade with confidence using our advanced encryption and multi-factor authentication systems.",
    },
    {
      icon: <PieChart size={28} />,
      title: "Portfolio Analysis",
      description:
        "Gain insights into your portfolio performance with comprehensive analysis tools and reports.",
    },
    {
      icon: <Bell size={28} />,
      title: "Price Alerts",
      description:
        "Never miss a trading opportunity with customizable price alerts and notifications.",
    },
    {
      icon: <Book size={28} />,
      title: "Trading Education",
      description:
        "Enhance your trading skills with our extensive library of educational resources and webinars.",
    },
  ];

  const testimonials = [
    {
      quote: "TradePro has revolutionized my trading strategy. The tools are intuitive and powerful, and the real-time data is a game-changer.",
      author: "John Doe",
      role: "Full-time Trader",
    },
    {
      quote: "As a beginner, I was intimidated by trading. TradePro's educational resources and user-friendly interface made it easy for me to get started.",
      author: "Jane Smith",
      role: "New Investor",
    },
    {
      quote: "The portfolio analysis tools are top-notch. I can easily track my investments and make informed decisions.",
      author: "Samuel Green",
      role: "Financial Analyst",
    },
  ];

  const [ismenuopen, setismenuopen] = useState(false);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <button
        className="p-2 rounded-md hover:bg-accent"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    );
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight"
        >
          TradePro
        </motion.div>
        <nav className="hidden md:block">
          <ul className="flex gap-6 items-center text-sm">
            {["Markets", "Trading", "Analysis", "Learn"].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {renderThemeChanger()}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md border border-transparent"
            onClick={() => router.push("/login")}
          >
            Start Trading
          </motion.button>
        </div>
        <div className="md:hidden flex items-center">
          {renderThemeChanger()}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-3 rounded-md p-2 hover:bg-accent"
            onClick={() => setismenuopen(!ismenuopen)}
            aria-label="Open menu"
          >
            {ismenuopen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </header>
      {ismenuopen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-card/95 backdrop-blur px-4 py-2 border-b"
        >
          <ul className="space-y-3">
            {["Markets", "Trading", "Analysis", "Learn"].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="block text-muted-foreground hover:text-foreground transition-colors py-2">
                  {item}
                </span>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md border border-transparent"
              >
                Start Trading
              </button>
            </motion.li>
          </ul>
        </motion.div>
      )}
      <main className="container mx-auto px-4">
        <Animatedsection>
          <div className="text-center py-16 md:py-20">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-semibold tracking-tight mb-5"
            >
              Trade Smarter,
              <br />
              Not Harder
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Access global markets with real-time data and advanced trading tools.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => router.push("/register")}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-sm hover:shadow-md border border-transparent inline-flex items-center"
            >
              Open Free Account <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                Why Choose TradePro?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Experience the advantage of professional-grade trading tools and resources.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {tradingFeatures.map((feature, index) => (
                <FeatureBox
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                What Our Users Say
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Thousands of traders trust TradePro to power their financial journey.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                Get Started in 3 Easy Steps
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground border h-16 w-16 flex items-center justify-center text-2xl font-semibold rounded-xl mb-4 shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-medium mb-1">Create Account</h3>
                <p className="text-muted-foreground text-sm">Sign up for a free account in minutes.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-secondary text-secondary-foreground border h-16 w-16 flex items-center justify-center text-2xl font-semibold rounded-xl mb-4 shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-medium mb-1">Fund Your Account</h3>
                <p className="text-muted-foreground text-sm">Securely deposit funds to start trading.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-accent text-accent-foreground border h-16 w-16 flex items-center justify-center text-2xl font-semibold rounded-xl mb-4 shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-medium mb-1">Start Trading</h3>
                <p className="text-muted-foreground text-sm">Access global markets and trade your favorite assets.</p>
              </div>
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="bg-card border rounded-2xl p-10 text-center my-16 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-base md:text-lg mb-8 text-muted-foreground">
              Join thousands of traders and start your journey to financial success.
            </p>
            <motion.button
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-sm hover:shadow-md border border-transparent"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/register")}
            >
              Create Free Account
            </motion.button>
          </div>
        </Animatedsection>
      </main>

      <footer className="bg-card/70 backdrop-blur border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-3 text-foreground">TradePro</h3>
              <p className="text-muted-foreground text-sm">Trade Smarter, Not Harder.</p>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Stocks</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Futures & Options</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">IPO</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Mutual Funds</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Social</h3>
              <div className="flex space-x-4 text-muted-foreground">
                <a href="#" className="hover:text-foreground"><Twitter /></a>
                <a href="#" className="hover:text-foreground"><Linkedin /></a>
                <a href="#" className="hover:text-foreground"><Instagram /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} TradePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
