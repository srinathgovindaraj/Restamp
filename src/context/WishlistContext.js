import React, { createContext, useContext, useState } from "react";
import ALL_PROPERTIES from "../data/properties";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // Initialize with initial sample properties
  const [wishlist, setWishlist] = useState(ALL_PROPERTIES.slice(0, 2));

  const isWishlisted = (id) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  const toggleWishlist = (tour) => {
    if (!tour) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(tour.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(tour.id));
      } else {
        return [tour, ...prev];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const restoreDefaultWishlist = () => {
    setWishlist(ALL_PROPERTIES);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        restoreDefaultWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
