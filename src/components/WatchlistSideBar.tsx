"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, X, Trash, Star } from "lucide-react";
import { useState } from "react";

export interface WatchlistItem {
  name: string;
  price: number;
}

export interface WatchlistSidebarProps {
  watchlist: WatchlistItem[];
  remove: (name: string) => void;
}

const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  watchlist,
  remove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Watchlist Toggle Button - Still positioned on the right */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-16 right-2 sm:right-4 z-50 bg-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-400 hover:scale-105 transition-all"
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Watchlist"
      >
        <ClipboardList size={20} />
        {watchlist.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {watchlist.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar - Now opens from the RIGHT */}
            <motion.aside
              initial={{ x: "100%" }} // Changed from "-100%"
              animate={{ x: 0 }}
              exit={{ x: "100%" }} // Changed from "-100%"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              // Changed left-0 to right-0
              className="fixed top-0 right-0 h-full w-64 sm:w-72 md:w-80 bg-gray-800 p-3 sm:p-4 text-gray-300 shadow-2xl z-[60] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <h3 className="text-md sm:text-lg md:text-xl font-semibold text-white">
                    Watchlist
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close Watchlist"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Watchlist Content */}
              {watchlist.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <ClipboardList className="mx-auto text-gray-600 mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                  <p className="text-xs sm:text-sm text-gray-400">
                    No items in watchlist.
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                    Add items to monitor their prices
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <div className="text-xs text-gray-400 mb-1 sm:mb-2">
                    {watchlist.length} item{watchlist.length !== 1 ? "s" : ""}{" "}
                    tracked
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {watchlist.map((item, index) => (
                      <motion.li
                        key={`${item.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="flex justify-between items-center p-2 sm:p-3 bg-gray-700 rounded-lg hover:bg-gray-600/70 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate text-sm sm:text-base">
                            {item.name}
                          </div>
                          <div className="text-xs sm:text-sm text-green-400 font-mono">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => remove(item.name)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded ml-2 flex-shrink-0"
                          title="Remove from watchlist"
                        >
                          <Trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.aside>

            {/* Backdrop - No change needed here for backdrop behavior */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-[55] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// AddToWatchlistButton component remains the same
export interface AddToWatchlistButtonProps {
  item: {
    name: string;
    price: number;
  };
  isInWatchlist: boolean;
  onAdd: (item: WatchlistItem) => void;
  onRemove: (name: string) => void;
}

export const AddToWatchlistButton: React.FC<AddToWatchlistButtonProps> = ({
  item,
  isInWatchlist,
  onAdd,
  onRemove,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isInWatchlist) {
      onRemove(item.name);
    } else {
      onAdd(item);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2
        ${
          isInWatchlist
            ? "bg-yellow-500 text-yellow-900 hover:bg-yellow-400 focus:ring-yellow-300"
            : "bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-blue-500"
        }
      `}
      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
          isInWatchlist ? "fill-current" : ""
        }`}
      />
      <span className="hidden sm:inline">
        {isInWatchlist ? "Watching" : "Watch"}
      </span>
    </motion.button>
  );
};

export default WatchlistSidebar;
