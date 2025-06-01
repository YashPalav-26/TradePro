"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react"; // Added useRef
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
  WatchlistItem as ClientWatchlistItem, // Renamed for clarity
  AddToWatchlistButton,
} from "@/components/WatchlistSideBar";

import PortfolioSidebarComponent, {
  PortfolioItem as ClientPortfolioItem,
} from "@/components/PortfolioSidebar";
import { fadeInUp } from "@/lib/animation";

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
type SentimentType = "Positive" | "Neutral" | "Negative";
const generateSentiment = (): SentimentType => {
  const sentiments: SentimentType[] = ["Positive", "Neutral", "Negative"];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};

interface MarketIndicesProps {
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
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
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void; // Updated to include quantity
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
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

            onAddToPortfolio({ name, price, quantity: 1 });
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
          {isClient
            ? price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              })
            : `₹${price.toFixed(2)}`}
        </span>

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
interface MostBoughtProps {
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void;
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
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
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void; // Updated
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
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
      shuffleArticles();
      const intervalId = setInterval(shuffleArticles, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isClientForNews, shuffleArticles]);

  const articlesToRender = isClientForNews ? articles : PRESET_NEWS;

  return (
    <motion.div {...fadeInUp} className="my-6 sm:my-8 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Latest News
        </h2>
        {isClientForNews && (
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

interface DbWatchlistItem {
  name: string;
  price?: number;
}

interface DbPortfolioItem {
  name: string;
  price?: number;
  quantity?: number;
}

const EnhancedTradeProDashboard: React.FC = () => {
  const [watchlist, setWatchlist] = useState<ClientWatchlistItem[]>([]);
  const [portfolio, setPortfolio] = useState<ClientPortfolioItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetError, setAssetError] = useState<string | null>(null);
  const router = useRouter();

  const initialFetchDone = useRef(false);

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  const debouncedSaveUserAssets = useCallback(
    (
      currentWatchlist: ClientWatchlistItem[],
      currentPortfolio: ClientPortfolioItem[],
      authToken: string
    ) => {
      // Clear any existing timer
      if ((debouncedSaveUserAssets as any).timer) {
        clearTimeout((debouncedSaveUserAssets as any).timer);
      }
      // Set a new timer
      (debouncedSaveUserAssets as any).timer = setTimeout(async () => {
        if (!authToken) {
          console.log("Save skipped: No token for debounced save.");
          return;
        }
        console.log("Debounced: Saving assets to backend...");
        try {
          const portfolioToSave = currentPortfolio.map((p) => ({
            name: p.name,

            price: p.purchasePrice,
            quantity: p.quantity,
          }));

          await axios.post(
            "/api/assets",
            { watchlist: currentWatchlist, portfolio: portfolioToSave },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          console.log("Debounced: Assets saved successfully.");
        } catch (error) {
          console.error("Debounced: Error saving assets:", error);
        }
      }, 1500);
    },
    []
  );

  const fetchUserAssets = useCallback(
    async (authToken: string) => {
      if (!authToken) {
        setIsLoadingAssets(false);
        setAssetError("Not authenticated.");
        return;
      }
      setIsLoadingAssets(true);
      setAssetError(null);
      console.log("Fetching user assets with token...");
      try {
        const response = await axios.get("/api/assets", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          console.log("Fetched assets:", response.data);

          setWatchlist(
            response.data.watchlist
              ?.map((item: DbWatchlistItem) => ({
                name: item.name,
                price: typeof item.price === "number" ? item.price : 0,
              }))
              .filter(
                (item: ClientWatchlistItem): item is ClientWatchlistItem =>
                  item.name && typeof item.price === "number"
              ) || []
          );

          setPortfolio(
            response.data.portfolio
              ?.map((item: DbPortfolioItem) => {
                const quantity =
                  typeof item.quantity === "number" ? item.quantity : 0;

                const purchasePrice =
                  typeof item.price === "number" ? item.price : 0;

                const currentPrice = purchasePrice;

                const totalInvested = purchasePrice * quantity;
                const currentValue = currentPrice * quantity;
                const profitLoss = currentValue - totalInvested;
                const profitLossPercent =
                  totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

                return {
                  name: item.name,
                  currentPrice: currentPrice,
                  quantity: quantity,
                  purchasePrice: purchasePrice,
                  totalInvested: totalInvested,
                  currentValue: currentValue,
                  profitLoss: profitLoss,
                  profitLossPercent: profitLossPercent,
                };
              })
              .filter(
                (item: ClientPortfolioItem): item is ClientPortfolioItem =>
                  item.name && typeof item.quantity === "number"
              ) || []
          );
          initialFetchDone.current = true;
        }
      } catch (error: any) {
        console.error(
          "Error fetching user assets:",
          error.response?.data || error.message
        );
        setAssetError(error.response?.data?.error || "Failed to load assets.");
        setWatchlist([]); // Clear on error
        setPortfolio([]); // Clear on error
        if (error.response?.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          router.push("/login"); // Redirect to login
        }
      } finally {
        setIsLoadingAssets(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setToken(savedToken);
      if (!initialFetchDone.current) {
        fetchUserAssets(savedToken);
      }
    } else {
      setIsLoadingAssets(false);
      router.push("/login");
    }
  }, [getToken, fetchUserAssets, router]);

  const addToWatchlist = useCallback(
    (item: ClientWatchlistItem) => {
      setWatchlist((prev) => {
        if (prev.some((stock) => stock.name === item.name)) return prev;
        const newWatchlist = [...prev, item];
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(newWatchlist, portfolio, token);
        return newWatchlist;
      });
    },
    [token, portfolio, debouncedSaveUserAssets]
  );

  const removeFromWatchlist = useCallback(
    (name: string) => {
      setWatchlist((prev) => {
        const newWatchlist = prev.filter((stock) => stock.name !== name);
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(newWatchlist, portfolio, token);
        return newWatchlist;
      });
    },
    [token, portfolio, debouncedSaveUserAssets]
  );

  const addToPortfolio = useCallback(
    (stockToAdd: { name: string; price: number; quantity: number }) => {
      setPortfolio((prevPortfolio) => {
        const existingStockIndex = prevPortfolio.findIndex(
          (p) => p.name === stockToAdd.name
        );
        let updatedPortfolio;

        if (existingStockIndex > -1) {
          updatedPortfolio = prevPortfolio.map((p, index) => {
            if (index === existingStockIndex) {
              const newQuantity = p.quantity + stockToAdd.quantity;
              const newTotalInvested =
                p.totalInvested + stockToAdd.price * stockToAdd.quantity;
              const newPurchasePrice =
                newQuantity > 0 ? newTotalInvested / newQuantity : 0;
              const currentPrice = stockToAdd.price; // Assume transaction price is current price
              const currentValue = currentPrice * newQuantity;
              const profitLoss = currentValue - newTotalInvested;
              const profitLossPercent =
                newTotalInvested > 0
                  ? (profitLoss / newTotalInvested) * 100
                  : 0;
              return {
                ...p,
                quantity: newQuantity,
                totalInvested: newTotalInvested,
                purchasePrice: newPurchasePrice,
                currentPrice: currentPrice,
                currentValue,
                profitLoss,
                profitLossPercent,
              };
            }
            return p;
          });
        } else {
          // New stock
          const totalInvested = stockToAdd.price * stockToAdd.quantity;
          updatedPortfolio = [
            ...prevPortfolio,
            {
              name: stockToAdd.name,
              currentPrice: stockToAdd.price,
              quantity: stockToAdd.quantity,
              purchasePrice: stockToAdd.price,
              totalInvested: totalInvested,
              currentValue: totalInvested, // Initially, current value is total invested
              profitLoss: 0,
              profitLossPercent: 0,
            },
          ];
        }
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, updatedPortfolio, token);
        return updatedPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  const removeFromPortfolio = useCallback(
    (name: string) => {
      setPortfolio((prev) => {
        const newPortfolio = prev.filter((i) => i.name !== name);
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, newPortfolio, token);
        return newPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  const updatePrice = useCallback(
    (name: string, newPrice: number) => {
      setPortfolio((prevPortfolio) => {
        const updatedPortfolio = prevPortfolio.map((stock) => {
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
        });

        return updatedPortfolio;
      });

      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((stock) =>
          stock.name === name ? { ...stock, price: newPrice } : stock
        )
      );
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  const handleTransaction = useCallback(
    (
      name: string,
      type: "buy" | "sell",
      transactionPrice: number,
      shares: number = 1
    ) => {
      // Added shares param
      setPortfolio((prevPortfolio) => {
        const itemIndex = prevPortfolio.findIndex((p) => p.name === name);
        let updatedPortfolio = [...prevPortfolio];

        if (itemIndex === -1 && type === "sell") {
          console.warn("Cannot sell stock not in portfolio:", name);
          return prevPortfolio; // No change
        }

        if (itemIndex > -1) {
          // Existing stock
          const stock = updatedPortfolio[itemIndex];
          let newQuantity = stock.quantity;
          let newTotalInvested = stock.totalInvested;
          let newPurchasePrice = stock.purchasePrice;

          if (type === "buy") {
            newQuantity += shares;
            newTotalInvested += transactionPrice * shares;
            newPurchasePrice =
              newQuantity > 0 ? newTotalInvested / newQuantity : 0;
          } else {
            // Sell
            if (shares > stock.quantity) {
              console.warn("Cannot sell more shares than owned for:", name);
              return prevPortfolio; // No change
            }
            newQuantity -= shares;

            if (newQuantity > 0) {
              newTotalInvested = newPurchasePrice * newQuantity;
            } else {
              newTotalInvested = 0; // Sold all
            }
          }

          if (newQuantity === 0 && type === "sell") {
            updatedPortfolio.splice(itemIndex, 1); // Remove if all sold
          } else {
            const currentValue = transactionPrice * newQuantity;
            const profitLoss = currentValue - newTotalInvested;
            const profitLossPercent =
              newTotalInvested > 0 ? (profitLoss / newTotalInvested) * 100 : 0;
            updatedPortfolio[itemIndex] = {
              ...stock,
              quantity: newQuantity,
              totalInvested: newTotalInvested,
              purchasePrice: newPurchasePrice,
              currentPrice: transactionPrice,
              currentValue,
              profitLoss,
              profitLossPercent,
            };
          }
        } else if (type === "buy") {
          // New stock being bought
          const newTotalInvested = transactionPrice * shares;
          updatedPortfolio.push({
            name,
            currentPrice: transactionPrice,
            quantity: shares,
            purchasePrice: transactionPrice,
            totalInvested: newTotalInvested,
            currentValue: newTotalInvested,
            profitLoss: 0,
            profitLossPercent: 0,
          });
        }
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, updatedPortfolio, token);
        return updatedPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  if (isLoadingAssets && !initialFetchDone.current) {
    // Show loading only on initial fetch
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading dashboard data...
      </div>
    );
  }
  if (!token && !isLoadingAssets) {
    // Handled by redirect in useEffect, but as a fallback UI
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Please login to view the dashboard.
      </div>
    );
  }
  if (assetError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Error: {assetError}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 flex flex-col lg:flex-row relative">
      <ActualWatchlistSidebar
        watchlist={watchlist}
        remove={removeFromWatchlist}
      />
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
            onAddToPortfolio={(item) =>
              addToPortfolio({
                name: item.name,
                price: item.price,
                quantity: 1,
              })
            } // Assuming add 1 quantity
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <ProductsAndTools />
          <TopGainers
            onAddToPortfolio={(item) =>
              addToPortfolio({
                name: item.name,
                price: item.price,
                quantity: 1,
              })
            } // Assuming add 1 quantity
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <div className="my-6 sm:my-8 px-2 sm:px-0">
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
          <TopByMarketCap />
          <NewsFeed />
        </main>
      </div>
    </div>
  );
};

export default EnhancedTradeProDashboard;
