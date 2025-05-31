"use client";
import { useState, useEffect, useMemo } from "react";
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
  const data = [["Time", "Low", "Open", "Close", "High"]];

  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - i * 5000).toLocaleTimeString();
    const open = currentValue + Math.random() * 10 - 5;
    const close = open + Math.random() * 10 - 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const high = Math.max(open, close) + Math.random() * 5;
    data.push([time, low, open, close, high]);
  }

  return data;
};

// Mock Chart component since Google Charts isn't available
const Chart = ({ chartType, width, height, data, options }) => {
  return (
    <div
      style={{ width, height }}
      className="bg-gray-700 rounded flex items-center justify-center text-gray-400"
    >
      <div className="text-center">
        <div>Candlestick Chart</div>
        <div className="text-sm mt-2">Data points: {data.length - 1}</div>
        <div className="text-xs mt-1">
          Current: {data[data.length - 1]?.[3]?.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const StockChart = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("5M");
  const [data, setData] = useState(() => generateRandomData(425371, 5));
  const [currentValue, setCurrentValue] = useState(425371);
  const [change, setChange] = useState({ value: 0, percentage: 0 });

  const getDataPoints = (range) => {
    switch (range) {
      case "5M":
        return 5;
      case "10M":
        return 10;
      case "15M":
        return 15;
      case "30M":
        return 30;
      case "1H":
        return 60;
      default:
        return 5;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomData(
        currentValue,
        getDataPoints(timeRange)
      );

      // Keep only recent data points to prevent infinite growth
      setData((prevData) => {
        const combinedData = [...prevData, ...newData.slice(1)];
        return combinedData.length > 100
          ? [combinedData[0], ...combinedData.slice(-50)]
          : combinedData;
      });

      const newCurrentValue = newData[newData.length - 1][3];
      setCurrentValue(newCurrentValue);

      // Calculate change based on first data point
      if (data.length > 1) {
        const initialValue = data[1][2];
        const changeValue = newCurrentValue - initialValue;
        const changePercentage = (changeValue / initialValue) * 100;
        setChange({ value: changeValue, percentage: changePercentage });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange, currentValue, data]);

  // Handle time range change
  useEffect(() => {
    const newData = generateRandomData(currentValue, getDataPoints(timeRange));
    setData(newData);
  }, [timeRange]);

  const options = useMemo(
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
      className="bg-gray-800 p-6 rounded-lg shadow-lg my-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{stock}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">
              {currentValue.toFixed(2)}
            </span>
            <motion.span
              className={`flex items-center ${
                change.value >= 0 ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={change.value}
            >
              {change.value >= 0 ? (
                <ArrowUpRight size={20} className="mr-1" />
              ) : (
                <ArrowDownRight size={20} className="mr-1" />
              )}
              {change.value > 0 ? "+" : ""}
              {change.value.toFixed(2)} ({change.percentage.toFixed(2)}%)
            </motion.span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <motion.button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="inline-block mr-2" size={16} />
            Create Alert
          </motion.button>
          <motion.button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="inline-block mr-2" size={16} />
            Watchlist
          </motion.button>
        </div>
      </div>
      <Chart
        chartType="CandlestickChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
      <div className="flex justify-between mt-4 overflow-x-auto">
        {["5M", "10M", "15M", "30M", "1H"].map((range) => (
          <motion.button
            key={range}
            className={`text-sm ${
              timeRange === range ? "text-blue-500" : "text-gray-300"
            } hover:text-blue-500 transition-colors flex items-center`}
            onClick={() => setTimeRange(range)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Clock size={14} className="mr-1" />
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
          callPrice: Math.max(0, option.callPrice + (Math.random() - 0.5) * 5),
          callChange: (Math.random() - 0.5) * 10,
          putPrice: Math.max(0, option.putPrice + (Math.random() - 0.5) * 5),
          putChange: (Math.random() - 0.5) * 10,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-6 rounded-lg shadow-lg my-6 overflow-x-auto"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <DollarSign size={24} className="mr-2" />
        Top {stock} Options
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-2">Strike</th>
            <th className="py-2">Call</th>
            <th className="py-2">Put</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <motion.tr
              key={index}
              className="border-b border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="py-2 text-white">{option.strike}</td>
              <td className="py-2">
                <div className="text-white">{option.callPrice.toFixed(2)}</div>
                <motion.div
                  className={
                    option.callChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.callChange}
                >
                  {option.callChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
                  )}
                  {option.callChange.toFixed(2)}%
                </motion.div>
              </td>
              <td className="py-2">
                <div className="text-white">{option.putPrice.toFixed(2)}</div>
                <motion.div
                  className={
                    option.putChange >= 0 ? "text-green-500" : "text-red-500"
                  }
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.putChange}
                >
                  {option.putChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
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
          0,
          prevData.putCallRatio + (Math.random() - 0.5) * 0.02
        ),
        totalCallOI: Math.max(
          0,
          prevData.totalCallOI + Math.floor((Math.random() - 0.5) * 10000)
        ),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-6 rounded-lg shadow-lg py-6"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <BarChart2 size={24} className="mr-2" />
        Open Interest (OI)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-gray-400">Total Put OI</div>
          <div className="text-white text-xl">
            {oiData.totalPutOI.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-gray-400">Put/Call ratio</div>
          <div className="text-white text-xl">
            {oiData.putCallRatio.toFixed(2)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-gray-400">Total Call OI</div>
          <div className="text-white text-xl">
            {oiData.totalCallOI.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function GrowwNIFTY50Page({ params }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="h-40 w-40 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Header />
      <main className="container mx-auto px-4">
        <Breadcrumb stock={params.id} />
        <StockChart stock={params.id} />
        <OptionsTable stock={params.id} />
        <OpenInterest />
      </main>
    </div>
  );
}
