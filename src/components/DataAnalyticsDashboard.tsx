"use client";

import { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartData, registerables } from "chart.js";
import TradingBot from "@/components/TradingBot";

Chart.register(...registerables);

type DataPoint = {
  time: string;
  price: number;
  rsi: number;
  volatility: number;
  movingAverage: number;
};

const DataAnalyticsDashboard = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "Price",
    "RSI",
    "Volatility",
    "Moving Average",
  ]);
  const [isLive, setIsLive] = useState(false);
  const [marketTrend, setMarketTrend] = useState(0);
  const [marketVolatility, setMarketVolatility] = useState(2);

  // Generate initial data
  useEffect(() => {
    const generateInitialData = () => {
      // FIX 1: Changed 'let' to 'const'
      const prices: number[] = [];
      const basePrice = 1000;

      return Array.from({ length: 50 }, (_, i) => {
        // Starting from oldest to newest
        const index = 49 - i;
        let price;

        if (prices.length === 0) {
          price = basePrice;
        } else {
          const prevPrice = prices[prices.length - 1];
          const randomFactor = (Math.random() - 0.5) * marketVolatility;
          const trendFactor = marketTrend / 10;
          price = Math.max(
            1,
            prevPrice * (1 + (randomFactor + trendFactor) / 100)
          );
        }

        prices.push(price);

        // Calculate RSI (simplified)
        const gains =
          prices.length > 1
            ? prices
                .filter((p, idx) => idx > 0 && p > prices[idx - 1])
                .map((p, idx) => p - prices[idx - 1])
            : [];
        const losses =
          prices.length > 1
            ? prices
                .filter((p, idx) => idx > 0 && p < prices[idx - 1])
                .map((p, idx) => prices[idx - 1] - p)
            : [];

        const avgGain =
          gains.length > 0
            ? gains.reduce((sum, g) => sum + g, 0) / gains.length
            : 0;
        const avgLoss =
          losses.length > 0
            ? losses.reduce((sum, l) => sum + l, 0) / losses.length
            : 0;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        // Calculate volatility (standard deviation of recent price changes)
        const recentPrices = prices.slice(-10);
        const priceChanges = recentPrices
          .map((p, idx) =>
            idx > 0
              ? ((p - recentPrices[idx - 1]) / recentPrices[idx - 1]) * 100
              : 0
          )
          .slice(1);

        const mean =
          priceChanges.length > 0 // Guard against division by zero
            ? priceChanges.reduce((sum, change) => sum + change, 0) /
              priceChanges.length
            : 0;
        const squaredDiffs = priceChanges.map((change) =>
          Math.pow(change - mean, 2)
        );
        const variance =
          squaredDiffs.length > 0 // Guard against division by zero
            ? squaredDiffs.reduce((sum, diff) => sum + diff, 0) /
              squaredDiffs.length
            : 0;
        const volatility = Math.sqrt(variance);

        // Calculate moving average
        const movingAverage =
          prices.length >= 5
            ? prices.slice(-5).reduce((sum, p) => sum + p, 0) / 5
            : price;

        return {
          time: new Date(
            Date.now() - (49 - index) * 60000
          ).toLocaleTimeString(),
          price,
          rsi,
          volatility: isNaN(volatility) ? 0 : volatility, // Ensure volatility is not NaN
          movingAverage,
        };
      });
    };

    setData(generateInitialData());
    // FIX 2: Added marketTrend and marketVolatility to dependency array
  }, [marketTrend, marketVolatility]);

  // Live data generation
  useEffect(() => {
    if (!isLive) return;

    const addNewDataPoint = () => {
      setData((currentData) => {
        if (currentData.length === 0) {
          // Handle case where currentData might be empty if initial data generation fails or is delayed
          // For now, let's just return the empty array to avoid errors,
          // or you could initialize a single point here.
          console.warn("Live data generation skipped: currentData is empty.");
          return currentData;
        }
        const lastPoint = currentData[currentData.length - 1];
        const prevPrice = lastPoint.price;

        // Generate new price using the same algorithm as in TradingBot
        const randomFactor = (Math.random() - 0.5) * marketVolatility;
        const trendFactor = marketTrend / 10;
        const newPrice = Math.max(
          1,
          prevPrice * (1 + (randomFactor + trendFactor) / 100)
        );

        // Get recent prices including the new one
        const allPricesForCalc = [
          ...currentData.slice(-13).map((d) => d.price), // Using 14 points for RSI-like calculation
          newPrice,
        ];

        // Calculate RSI
        let gainsRSI = 0;
        let lossesRSI = 0;
        for (let i = 1; i < allPricesForCalc.length; i++) {
          const diff = allPricesForCalc[i] - allPricesForCalc[i - 1];
          if (diff > 0) gainsRSI += diff;
          else lossesRSI += Math.abs(diff);
        }
        const avgGainRSI = gainsRSI / (allPricesForCalc.length - 1);
        const avgLossRSI = lossesRSI / (allPricesForCalc.length - 1);
        const rs = avgLossRSI === 0 ? 100 : avgGainRSI / avgLossRSI; // Avoid division by zero
        const rsi = 100 - 100 / (1 + rs);

        // Calculate volatility
        const recentPricesForVol = allPricesForCalc.slice(-10); // Use last 10 for volatility
        const pricePercentChanges = recentPricesForVol
          .map((p, idx, arr) =>
            idx > 0 ? ((p - arr[idx - 1]) / arr[idx - 1]) * 100 : 0
          )
          .slice(1);

        const mean =
          pricePercentChanges.length > 0
            ? pricePercentChanges.reduce((sum, change) => sum + change, 0) /
              pricePercentChanges.length
            : 0;
        const squaredDiffs = pricePercentChanges.map((change) =>
          Math.pow(change - mean, 2)
        );
        const variance =
          squaredDiffs.length > 0
            ? squaredDiffs.reduce((sum, diff) => sum + diff, 0) /
              squaredDiffs.length
            : 0;
        const volatility = Math.sqrt(variance);

        // Calculate moving average (e.g., 5-period)
        const recentPricesForMA = allPricesForCalc.slice(-5);
        const movingAverage =
          recentPricesForMA.reduce((sum, p) => sum + p, 0) /
          recentPricesForMA.length;

        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          price: newPrice,
          rsi: isNaN(rsi) ? 50 : rsi, // Default if NaN
          volatility: isNaN(volatility) ? 0 : volatility, // Default if NaN
          movingAverage,
        };

        // Keep only the last 50 data points
        const updatedData = [...currentData, newDataPoint];
        if (updatedData.length > 50) {
          return updatedData.slice(1);
        }
        return updatedData;
      });
    };

    const interval = setInterval(addNewDataPoint, 1000);
    return () => clearInterval(interval);
  }, [isLive, marketTrend, marketVolatility]);

  const chartData: ChartData<"line"> | null = useMemo(() => {
    if (data.length === 0) return null;

    const datasets = [
      selectedMetrics.includes("Price") && {
        label: "Price",
        data: data.map((point) => point.price),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y",
      },
      selectedMetrics.includes("RSI") && {
        label: "RSI",
        data: data.map((point) => point.rsi),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y1",
      },
      selectedMetrics.includes("Volatility") && {
        label: "Volatility",
        data: data.map((point) => point.volatility),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y1",
      },
      selectedMetrics.includes("Moving Average") && {
        label: "Moving Average",
        data: data.map((point) => point.movingAverage),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y",
      },
    ].filter(Boolean) as ChartData<"line">["datasets"];

    return datasets.length > 0
      ? {
          labels: data.map((point) => point.time),
          datasets,
        }
      : null;
  }, [data, selectedMetrics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Price",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Indicators",
        },
        min: 0,
        // max: 100, // RSI is 0-100, but volatility can be different. Consider dynamic max or separate axes.
        grid: {
          drawOnChartArea: false,
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(229, 231, 235)",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Container with responsive padding */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header - Responsive typography */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            Financial Data Analytics Dashboard
          </h2>
        </div>

        {/* Controls Section */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {/* Metric Selection Buttons */}
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-center text-gray-300">
              Select Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {["Price", "RSI", "Volatility", "Moving Average"].map(
                (metric) => (
                  <button
                    key={metric}
                    className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                      selectedMetrics.includes(metric)
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                    onClick={() =>
                      setSelectedMetrics((prev) =>
                        prev.includes(metric)
                          ? prev.filter((m) => m !== metric)
                          : [...prev, metric]
                      )
                    }
                  >
                    {metric}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Live Data Toggle */}
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-center text-gray-300">
              Data Control
            </h3>
            <div className="flex justify-center">
              <button
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                  isLive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                } shadow-lg`}
                onClick={() => setIsLive((prev) => !prev)}
              >
                {isLive ? "⏸️ Pause Live Data" : "▶️ Generate Live Data"}
              </button>
            </div>
          </div>

          {/* Market Controls */}
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-center text-gray-300">
              Market Parameters
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Market Trend Control */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm md:text-base font-medium text-center text-gray-300">
                  Market Trend
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={marketTrend}
                  onChange={(e) => setMarketTrend(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span
                    className={`text-xs sm:text-sm md:text-base font-semibold px-2 py-1 rounded ${
                      marketTrend < 0
                        ? "bg-red-600/20 text-red-400"
                        : marketTrend > 0
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {marketTrend < 0
                      ? "📉 Bearish"
                      : marketTrend > 0
                      ? "📈 Bullish"
                      : "➡️ Neutral"}{" "}
                    ({marketTrend})
                  </span>
                </div>
              </div>

              {/* Market Volatility Control */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm md:text-base font-medium text-center text-gray-300">
                  Market Volatility
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={marketVolatility}
                  onChange={(e) =>
                    setMarketVolatility(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span
                    className={`text-xs sm:text-sm md:text-base font-semibold px-2 py-1 rounded ${
                      marketVolatility <= 3
                        ? "bg-green-600/20 text-green-400"
                        : marketVolatility <= 6
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    📊 Level {marketVolatility}
                    {marketVolatility <= 3 && " (Low)"}
                    {marketVolatility > 3 &&
                      marketVolatility <= 6 &&
                      " (Medium)"}
                    {marketVolatility > 6 && " (High)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-2 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <div className="h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            {chartData && chartData.datasets.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse text-2xl sm:text-3xl md:text-4xl mb-2">
                    ⏳
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                    Loading chart data or no metrics selected...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trading Bot Section */}
        <div className="bg-gray-800/50 rounded-lg p-2 sm:p-4 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center">
            🤖 Algorithmic Trading Bot
          </h3>
          <TradingBot />
        </div>
      </div>

      {/* Custom styles for range sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }

        @media (max-width: 380px) {
          .xs\\:h-\\[300px\\] {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default DataAnalyticsDashboard;
