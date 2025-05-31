// src/app/dashboard/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
// ... other imports ...
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  BarChart2,
  PieChart,
  DollarSign,
  Activity,
  PlusSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import axios from "axios";

import ActualWatchlistSidebar, {
  WatchlistItem,
  AddToWatchlistButton,
} from "@/components/WatchlistSideBar";

import PortfolioSidebarComponent, {
  PortfolioItem,
} from "@/components/PortfolioSidebar";
import { fadeInUp } from "@/lib/animation";

type SentimentType = "Positive" | "Neutral" | "Negative";

// ... (PRESET_NEWS, TabSection remain the same) ...
const PRESET_NEWS = [
  {
    id: 1,
    title: "Global Markets Rally on Tech Gains",
    source: "Reuters",
    url: "https://www.reuters.com/markets/global-markets-rally-tech-gains-2025-04-23/",
    summary:
      "Tech stocks led a global market rally today as investors cheered strong earnings reports.",
  },
  {
    id: 2,
    title: "Oil Prices Dip Amid Supply Easing",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/news/articles/2025-04-22/oil-prices-dip-amid-supply-easing",
    summary:
      "Oil prices fell for a second session as OPEC+ signaled plans to boost output.",
  },
  {
    id: 3,
    title: "India's GDP Growth Forecast Upgraded",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/news/economy/indicators/indias-gdp-growth-forecast-upgraded-2025/articleshow/99712345.cms",
    summary:
      "The Reserve Bank raised its GDP growth forecast for India for the fiscal year to 7.2%.",
  },
  {
    id: 4,
    title: "Cryptocurrency Volatility Returns",
    source: "CoinDesk",
    url: "https://www.coindesk.com/markets/2025/04/23/cryptocurrency-volatility-returns/",
    summary:
      "Bitcoin and Ethereum saw swings of more than 5% amid macroeconomic uncertainty.",
  },
  {
    id: 5,
    title: "Federal Reserve Signals Interest Rate Pause",
    source: "Financial Times",
    url: "https://www.ft.com/content/federal-reserve-signals-interest-rate-pause-2025",
    summary:
      "The Fed indicated it may pause rate hikes after recent banking sector turbulence and inflation moderation.",
  },
];
const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Stocks");
  const tabs = ["Stocks", "Mutual Funds", "ETFs", "Options", "Futures"];
  return (
    <motion.div {...fadeInUp} className="border-b border-gray-700">
      {" "}
      <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto py-2 px-2 sm:px-0 scrollbar-hide">
        {" "}
        {tabs.map((tab) => (
          <motion.li
            key={tab}
            className={`cursor-pointer whitespace-nowrap text-sm sm:text-base pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-300 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {" "}
            {tab}{" "}
          </motion.li>
        ))}{" "}
      </ul>{" "}
    </motion.div>
  );
};

const generateSentiment = (): SentimentType => {
  const sentiments: SentimentType[] = ["Positive", "Neutral", "Negative"];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};

interface MarketIndicesProps {
  watchlist: WatchlistItem[];
  onAddToWatchlist: (item: WatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}

interface MarketIndexData {
  name: string;
  value: number;
  change: number;
  percentChange: number;
  sentiment: SentimentType;
}

const MarketIndices: React.FC<MarketIndicesProps> = ({
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const router = useRouter();
  const initialMarketData: MarketIndexData[] = [
    {
      name: "NIFTY50",
      value: 18245.32,
      change: 0,
      percentChange: 0,
      sentiment: "Neutral",
    },
    {
      name: "SENSEX",
      value: 61002.57,
      change: 0,
      percentChange: 0,
      sentiment: "Neutral",
    },
    {
      name: "BANKNIFTY",
      value: 43123.45,
      change: 0,
      percentChange: 0,
      sentiment: "Neutral",
    },
  ];
  const [marketData, setMarketData] = useState<MarketIndexData[]>(
    initialMarketData.map((i) => ({ ...i }))
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setMarketData((prevData): MarketIndexData[] =>
        prevData.map((index) => {
          const delta = (Math.random() * 2 - 1) * (index.value * 0.001);
          const pct = index.value !== 0 ? (delta / index.value) * 100 : 0;
          const newValue = index.value + delta;
          return {
            /* ...index, */ name: index.name,
            value: Math.max(0.01, newValue),
            change: delta,
            percentChange: pct,
            sentiment: generateSentiment(),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <motion.div
      {...fadeInUp}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-4 px-2 sm:px-0"
    >
      {marketData.map((index) => {
        const isWatched = watchlist.some(
          (watchItem) => watchItem.name === index.name
        );
        return (
          <motion.div
            key={index.name}
            className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/dashboard/${index.name}`)}
          >
            {/* ... AddToWatchlistButton ... */}
            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {" "}
              <AddToWatchlistButton
                item={{ name: index.name, price: index.value }}
                isInWatchlist={isWatched}
                onAdd={onAddToWatchlist}
                onRemove={onRemoveFromWatchlist}
              />{" "}
            </div>
            <h3 className="font-semibold text-gray-300 text-sm sm:text-base pr-8">
              {index.name}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 mt-2">
              <span className="text-base sm:text-lg text-white font-medium">
                {
                  isClient
                    ? index.value.toLocaleString("en-IN", {
                        // DEFER FORMATTING
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                      })
                    : `₹${index.value.toFixed(2)}` /* Basic server fallback */
                }
              </span>
              {/* ... change display ... */}
              <motion.span
                key={index.change}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs sm:text-sm flex items-center ${
                  index.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {" "}
                {index.change >= 0 ? (
                  <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />
                )}{" "}
                {index.change.toFixed(2)} ({index.percentChange.toFixed(2)}%){" "}
              </motion.span>
            </div>
            {/* ... sentiment display ... */}
            <motion.div
              className={`mt-2 text-xs sm:text-sm font-semibold ${
                index.sentiment === "Positive"
                  ? "text-green-400"
                  : index.sentiment === "Negative"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {" "}
              Sentiment: {index.sentiment}{" "}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

interface StockCardProps {
  name: string;
  initialPrice: number;
  onAddToPortfolio: (item: WatchlistItem) => void;
  watchlist: WatchlistItem[];
  onAddToWatchlist: (item: WatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  name,
  initialPrice,
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [change, setChange] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [sentiment, setSentiment] = useState<SentimentType>("Neutral");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      const delta = (Math.random() * 2 - 1) * (price * 0.01);
      const pct = price !== 0 ? (delta / price) * 100 : 0;
      setPrice((prev) => Math.max(0.01, prev + delta));
      setChange(delta);
      setPercentChange(pct);
      setSentiment(generateSentiment());
    }, 1500);
    return () => clearInterval(interval);
  }, [price, isClient]);

  const isWatched = watchlist.some((watchItem) => watchItem.name === name);

  return (
    <motion.div
      className="relative bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/dashboard/${name}`)}
    >
      {/* ... buttons ... */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
        {" "}
        <div onClick={(e) => e.stopPropagation()}>
          {" "}
          <AddToWatchlistButton
            item={{ name, price }}
            isInWatchlist={isWatched}
            onAdd={onAddToWatchlist}
            onRemove={onRemoveFromWatchlist}
          />{" "}
        </div>{" "}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPortfolio({ name, price });
          }}
          className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors flex items-center justify-center"
          title="Add to Portfolio"
        >
          {" "}
          <PlusSquare size={14} className="sm:w-4 sm:h-4" />{" "}
        </button>{" "}
      </div>
      <h3 className="font-semibold text-white mb-2 text-sm sm:text-base pr-16 sm:pr-20">
        {name}
      </h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
        <span className="text-base sm:text-lg text-white font-medium">
          {
            isClient
              ? price.toLocaleString("en-IN", {
                  // DEFER FORMATTING
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 2,
                })
              : `₹${price.toFixed(2)}` /* Basic server fallback */
          }
        </span>
        {/* ... change display ... */}
        <motion.span
          key={`${name}-${change}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs sm:text-sm flex items-center ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {" "}
          {change >= 0 ? (
            <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
          ) : (
            <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />
          )}{" "}
          {change.toFixed(2)} ({percentChange.toFixed(2)}%){" "}
        </motion.span>
      </div>
      {/* ... sentiment display ... */}
      <motion.div
        className={`mt-2 text-xs sm:text-sm font-semibold ${
          sentiment === "Positive"
            ? "text-green-400"
            : sentiment === "Negative"
            ? "text-red-400"
            : "text-gray-400"
        }`}
      >
        {" "}
        Sentiment: {sentiment}{" "}
      </motion.div>
    </motion.div>
  );
};

// ... (MostBought, ProductsAndTools, TopGainers, TopByMarketCap remain the same structurally) ...
interface MostBoughtProps {
  onAddToPortfolio: (item: WatchlistItem) => void;
  watchlist: WatchlistItem[];
  onAddToWatchlist: (item: WatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}
const MostBought: React.FC<MostBoughtProps> = ({
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const list = [
    { name: "Reliance", price: 2345.6 },
    { name: "Tata Motors", price: 456.75 },
    { name: "Suzlon Energy", price: 18.45 },
    { name: "Zomato", price: 82.3 },
  ];
  return (
    <motion.div {...fadeInUp} className="my-6 sm:my-8 px-2 sm:px-0">
      {" "}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        {" "}
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {" "}
          Most Bought on TradePro{" "}
        </h2>{" "}
        <motion.a
          href="#"
          className="text-blue-500 text-sm hover:underline flex items-center self-start sm:self-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {" "}
          View all <ChevronRight size={16} className="ml-1" />{" "}
        </motion.a>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {" "}
        {list.map((s) => (
          <StockCard
            key={s.name}
            name={s.name}
            initialPrice={s.price}
            onAddToPortfolio={onAddToPortfolio}
            watchlist={watchlist}
            onAddToWatchlist={onAddToWatchlist}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
          />
        ))}{" "}
      </div>{" "}
    </motion.div>
  );
};
const ProductsAndTools = () => {
  const products = [
    { name: "F&O", icon: BarChart2 },
    { name: "IPO", icon: DollarSign },
    { name: "ETFs", icon: PieChart },
    { name: "FDs", icon: TrendingUp },
    { name: "US Stocks", icon: Activity },
  ];
  return (
    <motion.div {...fadeInUp} className="my-6 sm:my-8 px-2 sm:px-0">
      {" "}
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
        {" "}
        Products & tools{" "}
      </h2>{" "}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {" "}
        {products.map((product) => (
          <motion.div
            key={product.name}
            className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: "#2D3748" }}
            whileTap={{ scale: 0.95 }}
          >
            {" "}
            <motion.div
              className="bg-blue-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {" "}
              <product.icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />{" "}
            </motion.div>{" "}
            <span className="text-gray-300 text-sm sm:text-base">
              {" "}
              {product.name}{" "}
            </span>{" "}
          </motion.div>
        ))}{" "}
      </div>{" "}
    </motion.div>
  );
};
interface TopGainersProps {
  onAddToPortfolio: (item: WatchlistItem) => void;
  watchlist: WatchlistItem[];
  onAddToWatchlist: (item: WatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}
const TopGainers: React.FC<TopGainersProps> = ({
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const list = [
    { name: "TCS", price: 3845.6 },
    { name: "HDFC Bank", price: 1535.6 },
    { name: "ICICI Bank", price: 945.6 },
    { name: "Bharti Airtel", price: 835.6 },
  ];
  return (
    <motion.div {...fadeInUp} className="my-6 sm:my-8 px-2 sm:px-0">
      {" "}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        {" "}
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {" "}
          Top Gainers{" "}
        </h2>{" "}
        <motion.a
          href="#"
          className="text-blue-500 text-sm hover:underline flex items-center self-start sm:self-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {" "}
          See more <ChevronRight size={16} className="ml-1" />{" "}
        </motion.a>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {" "}
        {list.map((s) => (
          <StockCard
            key={s.name}
            name={s.name}
            initialPrice={s.price}
            onAddToPortfolio={onAddToPortfolio}
            watchlist={watchlist}
            onAddToWatchlist={onAddToWatchlist}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
          />
        ))}{" "}
      </div>{" "}
    </motion.div>
  );
};
const TopByMarketCap = () => {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const companies = [
    { name: "Reliance Industries", marketCap: 1923456.78 },
    { name: "TCS", marketCap: 1434567.89 },
    { name: "HDFC Bank", marketCap: 1187654.32 },
    { name: "Infosys", marketCap: 676543.21 },
    { name: "ICICI Bank", marketCap: 654321.98 },
  ];
  return (
    <motion.div {...fadeInUp} className="py-6 sm:py-8 px-2 sm:px-0">
      {" "}
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
        {" "}
        Top by Market Cap{" "}
      </h2>{" "}
      <div className="space-y-3 sm:space-y-4">
        {" "}
        {companies.map((company) => (
          <motion.div
            key={company.name}
            layout
            className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() =>
              setExpandedCompany(
                expandedCompany === company.name ? null : company.name
              )
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {" "}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              {" "}
              <span className="text-white text-sm sm:text-base font-medium">
                {" "}
                {company.name}{" "}
              </span>{" "}
              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                {" "}
                <span className="text-gray-300 text-sm sm:text-base">
                  {" "}
                  ₹{" "}
                  {company.marketCap.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  Cr{" "}
                </span>{" "}
                <motion.div
                  animate={{
                    rotate: expandedCompany === company.name ? 45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {" "}
                  <Plus className="text-blue-500 w-5 h-5" />{" "}
                </motion.div>{" "}
              </div>{" "}
            </div>{" "}
            <AnimatePresence>
              {" "}
              {expandedCompany === company.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-300 overflow-hidden"
                >
                  {" "}
                  <p className="text-sm sm:text-base mb-2">
                    {" "}
                    Additional information about {company.name} goes here.{" "}
                  </p>{" "}
                  <p className="text-sm sm:text-base mb-4">
                    {" "}
                    You can add more details, charts, or any other relevant
                    data.{" "}
                  </p>{" "}
                  <motion.button
                    className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {" "}
                    View Details <ChevronRight
                      size={16}
                      className="ml-1"
                    />{" "}
                  </motion.button>{" "}
                </motion.div>
              )}{" "}
            </AnimatePresence>{" "}
          </motion.div>
        ))}{" "}
      </div>{" "}
    </motion.div>
  );
};

const NewsFeed = () => {
  const [articles, setArticles] = useState(() => PRESET_NEWS); // Initial state for server
  const [isClientForNews, setIsClientForNews] = useState(false);

  useEffect(() => {
    setIsClientForNews(true);
  }, []);

  const shuffleArticles = useCallback(() => {
    setArticles((prevArticles) =>
      [...prevArticles].sort(() => Math.random() - 0.5)
    );
  }, []);

  useEffect(() => {
    if (isClientForNews) {
      // Only shuffle and start interval on client after mount
      shuffleArticles(); // Initial shuffle on client side
      const intervalId = setInterval(shuffleArticles, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isClientForNews, shuffleArticles]);

  // Render PRESET_NEWS directly if not client yet, or the shuffled articles if client
  const articlesToRender = isClientForNews ? articles : PRESET_NEWS;

  return (
    <motion.div {...fadeInUp} className="my-6 sm:my-8 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Latest News
        </h2>
        {isClientForNews && ( // Only show refresh button on client
          <motion.button
            onClick={shuffleArticles}
            className="text-blue-500 text-sm hover:underline flex items-center self-start sm:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh news
          </motion.button>
        )}
      </div>
      <div className="space-y-3 sm:space-y-4">
        {articlesToRender.map(
          (
            article // Use articlesToRender
          ) => (
            <a
              key={article.id} // Key should be stable
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                {article.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-2">
                {article.source}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {article.summary}
              </p>
            </a>
          )
        )}
      </div>
    </motion.div>
  );
};

const EnhancedTradeProDashboard: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // --- All your useCallback wrapped functions (fetchUserAssets, saveUserAssets, addToWatchlist, etc.) remain unchanged here ---
  const fetchUserAssets = useCallback(async (authToken: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/fetch-assets",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        setWatchlist(
          response.data.watchlist
            ?.map((item: any) => ({
              name: item.name,
              price: typeof item.price === "number" ? item.price : 0,
            }))
            .filter(
              (item: WatchlistItem) =>
                item.name && typeof item.price === "number"
            ) || []
        );
        setPortfolio(
          response.data.portfolio
            ?.map((item: any) => {
              const currentPrice =
                typeof item.currentPrice === "number"
                  ? item.currentPrice
                  : typeof item.purchasePrice === "number"
                  ? item.purchasePrice
                  : 0;
              const quantity =
                typeof item.quantity === "number" ? item.quantity : 0;
              const purchasePrice =
                typeof item.purchasePrice === "number" ? item.purchasePrice : 0;
              const totalInvested =
                typeof item.totalInvested === "number"
                  ? item.totalInvested
                  : purchasePrice * quantity;
              const currentValue = currentPrice * quantity;
              const profitLoss = currentValue - totalInvested;
              const profitLossPercent =
                totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
              return {
                name: item.name,
                currentPrice,
                quantity,
                purchasePrice,
                totalInvested,
                currentValue,
                profitLoss,
                profitLossPercent,
              };
            })
            .filter((item: PortfolioItem) => item.name) || []
        );
      }
    } catch (error) {
      console.error("Error fetching user assets:", error);
      setWatchlist([]);
      setPortfolio([]);
    }
  }, []);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);
  useEffect(() => {
    if (token) {
      fetchUserAssets(token);
    }
  }, [token, fetchUserAssets]);
  const saveUserAssets = useCallback(async () => {
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/auth/save-assets",
        { watchlist, portfolio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error saving assets:", error);
    }
  }, [token, watchlist, portfolio]);
  useEffect(() => {
    if (token) {
      const handler = setTimeout(() => {
        saveUserAssets();
      }, 1500);
      return () => clearTimeout(handler);
    }
  }, [watchlist, portfolio, token, saveUserAssets]);
  const addToWatchlist = useCallback((item: WatchlistItem) => {
    setWatchlist((prev) =>
      prev.some((stock) => stock.name === item.name) ? prev : [...prev, item]
    );
  }, []);
  const removeFromWatchlist = useCallback((name: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock.name !== name));
  }, []);
  const addToPortfolio = useCallback((stockToAdd: WatchlistItem) => {
    setPortfolio((prevPortfolio) => {
      const existingStock = prevPortfolio.find(
        (p) => p.name === stockToAdd.name
      );
      if (existingStock) {
        return prevPortfolio.map((p) =>
          p.name === stockToAdd.name
            ? (() => {
                const newQuantity = p.quantity + 1;
                const newTotalInvested = p.totalInvested + stockToAdd.price;
                const newPurchasePrice =
                  newQuantity > 0 ? newTotalInvested / newQuantity : 0;
                const newCurrentPriceVal = stockToAdd.price;
                const newCurrentValue = newCurrentPriceVal * newQuantity;
                const newProfitLoss = newCurrentValue - newTotalInvested;
                const newProfitLossPercent =
                  newTotalInvested > 0
                    ? (newProfitLoss / newTotalInvested) * 100
                    : 0;
                return {
                  ...p,
                  quantity: newQuantity,
                  totalInvested: newTotalInvested,
                  purchasePrice: newPurchasePrice,
                  currentPrice: newCurrentPriceVal,
                  currentValue: newCurrentValue,
                  profitLoss: newProfitLoss,
                  profitLossPercent: newProfitLossPercent,
                };
              })()
            : p
        );
      } else {
        return [
          ...prevPortfolio,
          {
            name: stockToAdd.name,
            currentPrice: stockToAdd.price,
            quantity: 1,
            purchasePrice: stockToAdd.price,
            totalInvested: stockToAdd.price,
            currentValue: stockToAdd.price,
            profitLoss: 0,
            profitLossPercent: 0,
          },
        ];
      }
    });
  }, []);
  const removeFromPortfolio = useCallback((name: string) => {
    setPortfolio((prev) => prev.filter((i) => i.name !== name));
  }, []);
  const updatePrice = useCallback((name: string, newPrice: number) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.map((stock) => {
        if (stock.name === name) {
          const updatedStock = { ...stock, currentPrice: newPrice };
          updatedStock.currentValue = newPrice * updatedStock.quantity;
          updatedStock.profitLoss =
            updatedStock.currentValue - updatedStock.totalInvested;
          updatedStock.profitLossPercent =
            updatedStock.totalInvested > 0
              ? (updatedStock.profitLoss / updatedStock.totalInvested) * 100
              : 0;
          return updatedStock;
        }
        return stock;
      })
    );
    setWatchlist((prevWatchlist) =>
      prevWatchlist.map((stock) =>
        stock.name === name ? { ...stock, price: newPrice } : stock
      )
    );
  }, []);
  const handleTransaction = useCallback(
    (name: string, type: "buy" | "sell", transactionPrice: number) => {
      setPortfolio((prevPortfolio) =>
        prevPortfolio
          .map((stock) => {
            if (stock.name === name) {
              let newQuantity = stock.quantity;
              let newTotalInvested = stock.totalInvested;
              let newPurchasePrice = stock.purchasePrice;
              const newCurrentPrice = transactionPrice;
              if (type === "buy") {
                newQuantity += 1;
                newTotalInvested += transactionPrice;
                if (newQuantity > 0)
                  newPurchasePrice = newTotalInvested / newQuantity;
                else newPurchasePrice = 0;
              } else if (type === "sell" && stock.quantity > 0) {
                newQuantity -= 1;
                newTotalInvested =
                  newQuantity > 0 ? stock.purchasePrice * newQuantity : 0;
              } else {
                return stock;
              }
              if (type === "sell" && newQuantity < 0) return null;
              const currentValue = newCurrentPrice * newQuantity;
              const profitLoss = currentValue - newTotalInvested;
              const profitLossPercent =
                newTotalInvested > 0
                  ? (profitLoss / newTotalInvested) * 100
                  : 0;
              return {
                ...stock,
                quantity: newQuantity,
                totalInvested: newQuantity > 0 ? newTotalInvested : 0,
                purchasePrice: newQuantity > 0 ? newPurchasePrice : 0,
                currentPrice: newCurrentPrice,
                currentValue,
                profitLoss,
                profitLossPercent,
              };
            }
            return stock;
          })
          .filter(
            (stock): stock is PortfolioItem =>
              stock !== null && stock.quantity > 0
          )
      );
    },
    []
  );
  // --- End of useCallback wrapped functions ---

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 flex flex-col lg:flex-row relative">
      {/* ActualWatchlistSidebar is for the left side */}
      <ActualWatchlistSidebar
        watchlist={watchlist}
        remove={removeFromWatchlist}
      />

      {/* Main content area (center/right) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 flex-1 max-w-7xl">
          <TabSection />
          <MarketIndices
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <MostBought
            onAddToPortfolio={addToPortfolio}
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <ProductsAndTools />
          <TopGainers
            onAddToPortfolio={addToPortfolio}
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <TopByMarketCap />

          {/* Portfolio Section - In Flow, Before NewsFeed */}
          <div className="my-6 sm:my-8 px-2 sm:px-0">
            {" "}
            {/* Standard section spacing and padding */}
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              My Portfolio
            </h2>
            <PortfolioSidebarComponent
              portfolio={portfolio}
              remove={removeFromPortfolio}
              updatePrice={updatePrice}
              handleTransaction={handleTransaction}
            />
          </div>

          <NewsFeed />
          {/* Any other components that should come after NewsFeed */}
        </main>
      </div>

      {/* NO fixed right sidebar for portfolio, as it's now in the main content flow */}
      {/* NO separate mobile/tablet portfolio section at the very bottom, as it's handled above */}
    </div>
  );
};

export default EnhancedTradeProDashboard;
