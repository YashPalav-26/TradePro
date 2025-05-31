"use client";
import { motion } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fadeInUp } from "@/app/dashboard/page"; // Assuming this path is correct

export interface PortfolioItem {
  name: string;
  currentPrice: number;
  quantity: number;
  purchasePrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface PortfolioSidebarProps {
  portfolio: PortfolioItem[];
  remove: (name: string) => void;
  updatePrice: (name: string, newPrice: number) => void;
  handleTransaction: (
    name: string,
    type: "buy" | "sell",
    price: number
  ) => void;
}

const PortfolioSidebar: React.FC<PortfolioSidebarProps> = ({
  portfolio,
  remove,
  updatePrice,
  handleTransaction,
}) => {
  // This state is for the sidebar's internal price simulation
  const [simulatedPrices, setSimulatedPrices] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    // Initialize or update simulatedPrices when the portfolio prop changes.
    // This ensures that new items or items with updated currentPrice from parent
    // are reflected in the simulation's base.
    if (portfolio.length > 0) {
      const initialSimPrices: { [key: string]: number } = {};
      portfolio.forEach((item) => {
        // Use item.currentPrice from prop as the base for simulation.
        // Default to 0 if it's not a valid number (though parent should ensure it is).
        initialSimPrices[item.name] =
          typeof item.currentPrice === "number" ? item.currentPrice : 0;
      });
      setSimulatedPrices(initialSimPrices);
    } else {
      setSimulatedPrices({}); // Clear if portfolio is empty
    }

    // Only set up interval if there's a portfolio to work on
    if (portfolio.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setSimulatedPrices((prevSimPrices) => {
        const newSimPrices = { ...prevSimPrices };
        // Iterate over the current portfolio items from the prop
        // to ensure we are simulating prices for all relevant stocks.
        portfolio.forEach((item) => {
          const basePrice = prevSimPrices[item.name];

          // Ensure basePrice is a number to prevent NaN issues.
          // If an item is new and somehow not in prevSimPrices yet, initialize it.
          const numericBasePrice =
            typeof basePrice === "number"
              ? basePrice
              : typeof item.currentPrice === "number"
              ? item.currentPrice
              : 0;

          const change = (Math.random() * 2 - 1) * 0.05; // ±5% max change
          const newPriceCandidate = numericBasePrice * (1 + change);
          newSimPrices[item.name] = Math.max(newPriceCandidate, 0.01); // Ensure price doesn't go below 0.01

          // Notify parent of the simulated price change
          updatePrice(item.name, newSimPrices[item.name]);
        });
        return newSimPrices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [portfolio, updatePrice]); // Rerun effect if portfolio or updatePrice callback changes

  // Calculate portfolio totals using item.currentPrice directly from props for accuracy
  const portfolioStats = portfolio.reduce(
    (acc, item) => {
      const safeCurrentPrice =
        typeof item.currentPrice === "number" ? item.currentPrice : 0;
      const itemCurrentValue = safeCurrentPrice * item.quantity;
      const itemProfitLoss = itemCurrentValue - item.totalInvested;

      return {
        totalInvested: acc.totalInvested + item.totalInvested,
        currentValue: acc.currentValue + itemCurrentValue,
        totalProfitLoss: acc.totalProfitLoss + itemProfitLoss,
      };
    },
    { totalInvested: 0, currentValue: 0, totalProfitLoss: 0 }
  );

  const totalProfitLossPercent =
    portfolioStats.totalInvested > 0
      ? (portfolioStats.totalProfitLoss / portfolioStats.totalInvested) * 100
      : 0;

  return (
    <motion.aside
      {...fadeInUp}
      className="w-full xl:w-80 bg-gray-800 p-4 text-gray-300 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign className="mr-2 text-blue-500" size={20} />
          Portfolio
        </h3>
        <PieChart className="text-gray-400" size={16} />
      </div>

      {portfolio.length > 0 && (
        <motion.div
          className="mb-6 p-3 bg-gray-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Invested</p>
              <p className="font-semibold text-white">
                ₹
                {portfolioStats.totalInvested.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Current Value</p>
              <p className="font-semibold text-white">
                ₹
                {portfolioStats.currentValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Total P&L</p>
              <div
                className={`font-semibold flex items-center ${
                  portfolioStats.totalProfitLoss >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {portfolioStats.totalProfitLoss >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                ₹
                {Math.abs(portfolioStats.totalProfitLoss).toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}
                ({totalProfitLossPercent >= 0 ? "+" : ""}
                {totalProfitLossPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {portfolio.length === 0 ? (
        <div className="text-center py-8">
          <PieChart className="mx-auto text-gray-500 mb-3" size={48} />
          <p className="text-sm text-gray-400">No assets in portfolio.</p>
          <p className="text-xs text-gray-500 mt-1">
            Add stocks to start tracking
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {portfolio.map((item) => {
            // Use item.currentPrice from prop for display, ensuring it's a number.
            // This is the most up-to-date value from the parent component.
            const displayPrice =
              typeof item.currentPrice === "number" ? item.currentPrice : 0;
            const displayPurchasePrice =
              typeof item.purchasePrice === "number" ? item.purchasePrice : 0;
            const displayTotalInvested =
              typeof item.totalInvested === "number" ? item.totalInvested : 0;

            // Recalculate these based on the safe displayPrice for consistent display
            const itemCurrentValue = displayPrice * item.quantity;
            const itemProfitLoss = itemCurrentValue - displayTotalInvested;
            const itemProfitLossPercent =
              displayTotalInvested > 0
                ? (itemProfitLoss / displayTotalInvested) * 100
                : 0;

            const allocation =
              portfolioStats.currentValue > 0
                ? (itemCurrentValue / portfolioStats.currentValue) * 100
                : 0;

            // For transaction actions, use the most current price available (from prop).
            const priceForTransaction = displayPrice;

            return (
              <motion.div
                key={item.name}
                className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                whileHover={{ scale: 1.02 }}
                layout
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {item.quantity} shares • {allocation.toFixed(1)}%
                      allocation
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.name)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove from portfolio"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Current Price</p>
                    <p className="font-medium text-white">
                      {/* This is the line that caused the error (line 209) */}₹
                      {displayPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg. Buy Price</p>
                    <p className="font-medium text-white">
                      ₹{displayPurchasePrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Invested</p>
                    <p className="font-medium text-white">
                      ₹{displayTotalInvested.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current Value</p>
                    <p className="font-medium text-white">
                      ₹{itemCurrentValue.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-400 text-xs">P&L</p>
                  <div
                    className={`font-semibold text-sm flex items-center ${
                      itemProfitLoss >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {itemProfitLoss >= 0 ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    ₹
                    {Math.abs(itemProfitLoss).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                    ({itemProfitLoss >= 0 ? "+" : ""}
                    {itemProfitLossPercent.toFixed(2)}%)
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={() =>
                      handleTransaction(item.name, "buy", priceForTransaction)
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy More
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      handleTransaction(item.name, "sell", priceForTransaction)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={item.quantity <= 0}
                  >
                    Sell
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.aside>
  );
};

export default PortfolioSidebar;
