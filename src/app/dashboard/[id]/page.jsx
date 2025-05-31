"use client";
import { useState, useEffect, useMemo, useCallback } from "react"; // Added useCallback
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Eye,
  Clock,
  DollarSign,
  BarChart2,
} from "lucide-react";
import Header from "@/components/Header";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const Breadcrumb = ({ stock }) => (
  <motion.div
    {...fadeInUp}
    className="flex items-center space-x-2 text-sm text-gray-400 my-4"
  >
    <a href="/" className="hover:text-blue-500">
      Home
    </a>
    <span>/</span>
    <a href="/dashboard" className="hover:text-blue-500">
      Stocks
    </a>
    <span>/</span>
    <span className="text-blue-500">{stock}</span>
  </motion.div>
);

const generateRandomData = (currentValue, points) => {
  const historicalData = [["Time", "Low", "Open", "Close", "High"]];
  let baseForHistorical = currentValue;
  for (let i = 0; i < points; i++) {
    const time = new Date(
      Date.now() - (points - 1 - i) * 5000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const fluctuationMagnitude = baseForHistorical * 0.001;
    const open =
      baseForHistorical + (Math.random() * 10 - 5) * fluctuationMagnitude;
    const close = open + (Math.random() * 10 - 5) * fluctuationMagnitude;
    const low =
      Math.min(open, close) - Math.random() * 5 * fluctuationMagnitude;
    const high =
      Math.max(open, close) + Math.random() * 5 * fluctuationMagnitude;
    historicalData.push([
      time,
      Math.max(0.01, low),
      Math.max(0.01, open),
      Math.max(0.01, close),
      Math.max(0.01, high),
    ]);
    baseForHistorical = close;
  }
  return historicalData;
};

// Mock Chart component
// FIX: Changed `options: _unusedOptions` to `options: _` to correctly mark the options prop's value as unused
const Chart = ({ chartType, width, height, data, options: _ }) => {
  const lastDataPoint = data && data.length > 1 ? data[data.length - 1] : null;
  const currentDisplayValue =
    lastDataPoint && typeof lastDataPoint[3] === "number"
      ? lastDataPoint[3].toFixed(2)
      : "N/A";

  return (
    <div
      style={{ width, height }}
      className="bg-gray-700 rounded flex items-center justify-center text-gray-400"
    >
      <div className="text-center">
        <div>{chartType || "Chart"} (Mock)</div>
        <div className="text-sm mt-2">
          Data points: {Math.max(0, data.length - 1)}
        </div>
        <div className="text-xs mt-1">Current: {currentDisplayValue}</div>
      </div>
    </div>
  );
};

// Static version for initial state and non-hook contexts, defined outside StockChart
function getDataPointsStatic(range) {
  switch (range) {
    case "5M":
      return 5 * 12;
    case "10M":
      return 10 * 12;
    case "15M":
      return 15 * 12;
    case "30M":
      return 30 * 12;
    case "1H":
      return 60 * 12;
    default:
      return 5 * 12;
  }
}

const StockChart = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("5M");
  const initialStockValue = 4253.71;

  const [data, setData] = useState(() =>
    generateRandomData(initialStockValue, getDataPointsStatic(timeRange))
  );

  const [currentValue, setCurrentValue] = useState(() => {
    // Initialize currentValue from the initial data generated
    const initialDataForCurrentValue = generateRandomData(
      initialStockValue,
      getDataPointsStatic(timeRange)
    );
    return initialDataForCurrentValue.length > 1
      ? initialDataForCurrentValue[initialDataForCurrentValue.length - 1][3] // Close price of the last point
      : initialStockValue;
  });

  const [change, setChange] = useState({ value: 0, percentage: 0 });

  const getDataPoints = useCallback((range) => {
    return getDataPointsStatic(range);
  }, []);

  useEffect(() => {
    const points = getDataPoints(timeRange);
    // When timeRange changes, we want to use the *current* live value as the base for new historical data
    const newData = generateRandomData(currentValue, points);
    setData(newData);

    if (newData.length > 1) {
      const newCurrentFromGenerated = newData[newData.length - 1][3]; // Close of the last point of new data
      // setCurrentValue(newCurrentFromGenerated); // No, this is for setting the "live" value.
      // The "live" value is already currentValue.
      // This effect is for displaying a historical range based on timeRange.

      const initialValInNewData = newData[1][2]; // Open of the first data point in the new set
      const changeVal = newCurrentFromGenerated - initialValInNewData;
      const changePercent =
        initialValInNewData !== 0 ? (changeVal / initialValInNewData) * 100 : 0;
      setChange({ value: changeVal, percentage: changePercent });
    }
  }, [timeRange, currentValue, getDataPoints]); // `currentValue` is needed if new historical data is based on it.

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prevLiveCurrentValue) => {
        const randomPercentageChange = (Math.random() - 0.5) * 0.001;
        const changeAmount = prevLiveCurrentValue * randomPercentageChange;
        const newLiveCurrentValue = Math.max(
          0.01,
          prevLiveCurrentValue + changeAmount
        );

        setData((prevChartData) => {
          if (!prevChartData || prevChartData.length < 1) return prevChartData;

          const newPointTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const lastBarInChart = prevChartData[prevChartData.length - 1];
          const open = lastBarInChart ? lastBarInChart[3] : newLiveCurrentValue; // Open is previous chart close
          const close = newLiveCurrentValue; // The new live value is the close of the new bar

          const barFluctuationMag = close * 0.0005;
          const low = Math.min(open, close) - Math.random() * barFluctuationMag;
          const high =
            Math.max(open, close) + Math.random() * barFluctuationMag;

          const newSingleDataPoint = [
            newPointTime,
            Math.max(0.01, low),
            Math.max(0.01, open),
            Math.max(0.01, close),
            Math.max(0.01, high),
          ];

          const dataWithoutHeader = prevChartData.slice(1);
          // Add new point, then slice to maintain window size, then prepend header
          const updatedContent = [...dataWithoutHeader, newSingleDataPoint];
          return [
            prevChartData[0],
            ...updatedContent.slice(-getDataPoints(timeRange)),
          ];
        });

        // Calculate change relative to the first data point currently displayed in the chart
        if (data.length > 1 && data[1] && typeof data[1][2] === "number") {
          const initialValForDisplayChange = data[1][2];
          const changeVal = newLiveCurrentValue - initialValForDisplayChange;
          const changePercent =
            initialValForDisplayChange !== 0
              ? (changeVal / initialValForDisplayChange) * 100
              : 0;
          setChange({ value: changeVal, percentage: changePercent });
        }
        return newLiveCurrentValue;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange, data, getDataPoints]); // `currentValue` is managed by setCurrentValue's callback, no need here.
  // `data` is a dependency because setChange reads it.

  const chartOptions = useMemo(
    () => ({
      backgroundColor: "transparent",
      chartArea: { width: "90%", height: "80%" },
      hAxis: {
        textStyle: { color: "#9CA3AF" },
        baselineColor: "#4B5563",
        gridlines: { color: "transparent" },
        format: "HH:mm",
      },
      vAxis: {
        textStyle: { color: "#9CA3AF" },
        baselineColor: "#4B5563",
        gridlines: { color: "#4B5563" },
      },
      legend: { position: "none" },
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: "#EF4444" },
        risingColor: { strokeWidth: 0, fill: "#10B981" },
      },
      animation: {
        startup: true,
        duration: 1000,
        easing: "out",
      },
    }),
    []
  );

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg my-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{stock}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {currentValue.toFixed(2)}
            </span>
            <motion.span
              className={`flex items-center text-sm md:text-base ${
                change.value >= 0 ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={change.value}
            >
              {change.value >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              {change.value > 0 ? "+" : ""}
              {change.value.toFixed(2)} ({change.percentage.toFixed(2)}%)
            </motion.span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <motion.button
            className="bg-blue-500 text-white px-3 py-2 md:px-4 text-xs md:text-sm rounded hover:bg-blue-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="inline-block mr-1 md:mr-2" size={14} />
            Create Alert
          </motion.button>
          <motion.button
            className="bg-gray-700 text-white px-3 py-2 md:px-4 text-xs md:text-sm rounded hover:bg-gray-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="inline-block mr-1 md:mr-2" size={14} />
            Watchlist
          </motion.button>
        </div>
      </div>
      <Chart
        chartType="CandlestickChart"
        width="100%"
        height="300px"
        data={data}
        options={chartOptions} // This prop is now handled as `options: _` in Chart definition
      />
      <div className="flex justify-around md:justify-between mt-4 overflow-x-auto space-x-1">
        {["5M", "10M", "15M", "30M", "1H"].map((range) => (
          <motion.button
            key={range}
            className={`text-xs sm:text-sm px-2 py-1 rounded ${
              timeRange === range
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            } transition-colors flex items-center`}
            onClick={() => setTimeRange(range)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock size={12} className="mr-1" />
            {range}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const OptionsTable = ({ stock }) => {
  const [options, setOptions] = useState([
    {
      strike: 25400,
      callPrice: 115.15,
      callChange: 17.0,
      putPrice: 97.55,
      putChange: -15.55,
    },
    {
      strike: 25300,
      callPrice: 95.4,
      callChange: -10.9,
      putPrice: 96.65,
      putChange: 28.85,
    },
    {
      strike: 25200,
      callPrice: 78.5,
      callChange: 32.78,
      putPrice: 73.65,
      putChange: -12.25,
    },
    {
      strike: 25100,
      callPrice: 29.7,
      callChange: -10.14,
      putPrice: 28.3,
      putChange: 20.74,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          callPrice: Math.max(
            0.01,
            option.callPrice + (Math.random() - 0.5) * (option.callPrice * 0.01)
          ),
          callChange: (Math.random() - 0.5) * 10,
          putPrice: Math.max(
            0.01,
            option.putPrice + (Math.random() - 0.5) * (option.putPrice * 0.01)
          ),
          putChange: (Math.random() - 0.5) * 10,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg my-6 overflow-x-auto"
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
        <DollarSign size={20} className="mr-2" /> Top {stock} Options
      </h3>
      <table className="w-full text-left min-w-[400px]">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700 text-xs md:text-sm">
            <th className="py-2 px-1 md:px-2">Strike</th>
            <th className="py-2 px-1 md:px-2">Call Price</th>
            <th className="py-2 px-1 md:px-2">Call Chg%</th>
            <th className="py-2 px-1 md:px-2">Put Price</th>
            <th className="py-2 px-1 md:px-2">Put Chg%</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <motion.tr
              key={`${option.strike}-${index}`}
              className="border-b border-gray-700 text-xs md:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <td className="py-2 px-1 md:px-2 text-white">{option.strike}</td>
              <td className="py-2 px-1 md:px-2 text-white">
                {option.callPrice.toFixed(2)}
              </td>
              <td className="py-2 px-1 md:px-2">
                <motion.div
                  className={
                    option.callChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  key={`call-${option.strike}-${option.callChange}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {option.callChange >= 0 ? (
                    <ArrowUpRight size={12} className="inline mr-0.5" />
                  ) : (
                    <ArrowDownRight size={12} className="inline mr-0.5" />
                  )}
                  {option.callChange.toFixed(2)}%
                </motion.div>
              </td>
              <td className="py-2 px-1 md:px-2 text-white">
                {option.putPrice.toFixed(2)}
              </td>
              <td className="py-2 px-1 md:px-2">
                <motion.div
                  className={
                    option.putChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  key={`put-${option.strike}-${option.putChange}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {option.putChange >= 0 ? (
                    <ArrowUpRight size={12} className="inline mr-0.5" />
                  ) : (
                    <ArrowDownRight size={12} className="inline mr-0.5" />
                  )}
                  {option.putChange.toFixed(2)}%
                </motion.div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

const OpenInterest = () => {
  const [oiData, setOiData] = useState({
    totalPutOI: 3513795,
    putCallRatio: 0.99,
    totalCallOI: 3555969,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOiData((prevData) => ({
        totalPutOI: Math.max(
          0,
          prevData.totalPutOI + Math.floor((Math.random() - 0.5) * 10000)
        ),
        putCallRatio: Math.max(
          0.1,
          prevData.putCallRatio + (Math.random() - 0.5) * 0.01
        ),
        totalCallOI: Math.max(
          0,
          prevData.totalCallOI + Math.floor((Math.random() - 0.5) * 10000)
        ),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg my-6"
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
        <BarChart2 size={20} className="mr-2" /> Open Interest (OI)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center md:text-left"
        >
          <div className="text-gray-400">Total Put OI</div>
          <div className="text-white text-lg md:text-xl font-semibold">
            {oiData.totalPutOI.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-gray-400">Put/Call Ratio</div>
          <div className="text-white text-lg md:text-xl font-semibold">
            {oiData.putCallRatio.toFixed(2)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center md:text-right"
        >
          <div className="text-gray-400">Total Call OI</div>
          <div className="text-white text-lg md:text-xl font-semibold">
            {oiData.totalCallOI.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function StockDetailPage({ params }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-white text-xl">Loading Chart Data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Header />
      <main className="container mx-auto px-4 pb-8">
        <Breadcrumb stock={params.id} />
        <StockChart stock={params.id} />
        <OptionsTable stock={params.id} />
        <OpenInterest />
      </main>
    </div>
  );
}
