// src/components/PortfolioSidebar.tsx
"use client";
import { fadeInUp } from "@/lib/animation";
import { motion } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

const PortfolioSidebarComponent: React.FC<PortfolioSidebarProps> = ({
  portfolio,
  remove,
  updatePrice, // Assumed to be memoized in parent
  handleTransaction, // Assumed to be memoized in parent
}) => {
  // Local state for simulated prices. This is ONLY for the visual effect.
  // The source of truth for actual current prices is the `portfolio` prop.
  const [displayPrices, setDisplayPrices] = useState<{ [key: string]: number }>(
    {}
  );

  // Ref to track if the initial display prices have been set from the portfolio prop
  const initialSyncDone = useRef(false);

  // --- EFFECT 1: Synchronize displayPrices with portfolio prop ---
  // This effect ensures that our local displayPrices are initialized from
  // and updated by the parent's portfolio data.
  useEffect(() => {
    // console.log("EFFECT 1: Syncing displayPrices with portfolio prop", portfolio);
    const newDisplayPrices: { [key: string]: number } = {};
    let changesMade = false;

    portfolio.forEach((item) => {
      const currentPropPrice =
        typeof item.currentPrice === "number" ? item.currentPrice : 0;
      newDisplayPrices[item.name] = currentPropPrice;
      if (displayPrices[item.name] !== currentPropPrice) {
        changesMade = true;
      }
    });

    // If the portfolio items themselves changed (e.g., item added/removed)
    if (
      Object.keys(newDisplayPrices).length !== Object.keys(displayPrices).length
    ) {
      changesMade = true;
    }

    if (changesMade) {
      // console.log("EFFECT 1: Updating displayPrices from prop:", newDisplayPrices);
      setDisplayPrices(newDisplayPrices);
    }
    initialSyncDone.current = true; // Mark that an attempt to sync has occurred
  }, [portfolio]); // Dependency: Only the portfolio prop from parent

  // --- EFFECT 2: Interval for simulating price fluctuations for DISPLAY ONLY ---
  // This effect updates the local `displayPrices` for visual purposes.
  // It then calls `updatePrice` to notify the parent of these *simulated* changes.
  useEffect(() => {
    if (!initialSyncDone.current || portfolio.length === 0) {
      // console.log("EFFECT 2: Interval - Skipping, initial sync not done or no portfolio.");
      return; // Don't run interval if not synced or portfolio is empty
    }

    // console.log("EFFECT 2: Interval - Setting up simulation interval.");
    const intervalId = setInterval(() => {
      // Create a *new* object for the next state to ensure React detects a change
      const nextDisplayPrices: { [key: string]: number } = {};
      let pricesChangedInSim = false;

      portfolio.forEach((item) => {
        // Iterate based on the current portfolio prop
        const basePrice =
          displayPrices[item.name] !== undefined
            ? displayPrices[item.name] // Use current display price as base for simulation
            : typeof item.currentPrice === "number"
            ? item.currentPrice
            : 0; // Fallback to prop price

        const numericBasePrice = typeof basePrice === "number" ? basePrice : 0;
        const randomFactor = (Math.random() * 2 - 1) * 0.005; // Smaller fluctuation (+/- 0.5%)
        const newSimulatedPrice = Math.max(
          numericBasePrice * (1 + randomFactor),
          0.01
        );

        nextDisplayPrices[item.name] = newSimulatedPrice;
        if (displayPrices[item.name] !== newSimulatedPrice) {
          pricesChangedInSim = true;
        }
      });

      if (pricesChangedInSim) {
        // console.log("EFFECT 2: Interval - Simulated prices changed:", nextDisplayPrices);
        setDisplayPrices(nextDisplayPrices); // Update local display prices

        // Propagate these *simulated* changes to the parent
        Object.entries(nextDisplayPrices).forEach(([name, newSimPrice]) => {
          const parentItem = portfolio.find((p) => p.name === name);
          // IMPORTANT: Only call updatePrice if the new simulated price is different
          // from what the PARENT currently holds. This is the key to prevent loops.
          if (parentItem && parentItem.currentPrice !== newSimPrice) {
            // console.log(`EFFECT 2: Interval - Calling updatePrice for ${name} to ${newSimPrice}`);
            updatePrice(name, newSimPrice);
          }
        });
      }
    }, 2500); // Simulation interval

    return () => {
      // console.log("EFFECT 2: Interval - Clearing simulation interval.");
      clearInterval(intervalId);
    };
    // Dependencies:
    // - `portfolio`: To know which items to simulate for. If portfolio items change (add/remove), restart interval.
    // - `displayPrices`: The simulation bases off the current display prices.
    // - `updatePrice`: The stable function to call the parent.
  }, [portfolio, displayPrices, updatePrice]);

  // --- JSX Calculation Setup ---
  const portfolioStats = portfolio.reduce(
    (acc, item) => {
      // ALWAYS use item.currentPrice from the prop (parent's state) for financial calculations
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
          <DollarSign className="mr-2 text-blue-500" size={20} /> Portfolio
        </h3>
        <PieChart className="text-gray-400" size={16} />
      </div>

      {portfolio.length > 0 && (
        <motion.div
          className="mb-6 p-3 bg-gray-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* ... Portfolio Stats JSX (same as yours) ... */}
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
            // For DISPLAY, use the local displayPrices.
            // For financial CALCULATIONS and TRANSACTIONS, use item.currentPrice from the prop.
            const priceForDisplay =
              displayPrices[item.name] !== undefined
                ? displayPrices[item.name]
                : item.currentPrice; // Fallback to prop price

            const actualCurrentPriceFromProp = item.currentPrice;
            const itemCurrentValueUsingActual =
              actualCurrentPriceFromProp * item.quantity;
            const itemProfitLossUsingActual =
              itemCurrentValueUsingActual - item.totalInvested;
            const itemProfitLossPercentUsingActual =
              item.totalInvested > 0
                ? (itemProfitLossUsingActual / item.totalInvested) * 100
                : 0;
            const allocation =
              portfolioStats.currentValue > 0
                ? (itemCurrentValueUsingActual / portfolioStats.currentValue) *
                  100
                : 0;
            // Price for transaction MUST come from the parent's data (prop)
            const priceForTransaction = actualCurrentPriceFromProp;

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
                      ₹{priceForDisplay.toFixed(2)} {/* Use priceForDisplay */}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg. Buy Price</p>
                    <p className="font-medium text-white">
                      ₹
                      {(typeof item.purchasePrice === "number"
                        ? item.purchasePrice
                        : 0
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Invested</p>
                    <p className="font-medium text-white">
                      ₹
                      {(typeof item.totalInvested === "number"
                        ? item.totalInvested
                        : 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current Value (Actual)</p>
                    <p className="font-medium text-white">
                      ₹{itemCurrentValueUsingActual.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-gray-400 text-xs">P&L (Actual)</p>
                  <div
                    className={`font-semibold text-sm flex items-center ${
                      itemProfitLossUsingActual >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {/* ... P&L JSX (same as yours) ... */}
                    {itemProfitLossUsingActual >= 0 ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    ₹
                    {Math.abs(itemProfitLossUsingActual).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 0 }
                    )}
                    ({itemProfitLossUsingActual >= 0 ? "+" : ""}
                    {itemProfitLossPercentUsingActual.toFixed(2)}%)
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
export default PortfolioSidebarComponent;
