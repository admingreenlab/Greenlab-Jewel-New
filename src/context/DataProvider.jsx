import React, { createContext,useRef, useState, useEffect } from "react";
import jwtAuthAxios from "../service/jwtAuth";
import { IonToast } from "@ionic/react"; 

export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [wishData, setWishData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const isFetching = useRef(false)

  // Fetch wishlist
  const fetchWishlist = async () => {
            if (isFetching.current) return;
        isFetching.current = true;
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await jwtAuthAxios.get("/master/wishlist");
      setWishData(res.data?.items || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Add item to wishlist
  const addToWishlist = async (itemId) => {
    try {
      await jwtAuthAxios.post("/master/wishlist", { itemId, userId: user._id });
      await fetchWishlist();
      setToastMessage("Item added to wishlist");
      setShowToast(true);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item");
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      await jwtAuthAxios.delete(`/master/wishlist/${itemId}`);
      setWishData((prev) => prev.filter((item) => item._id !== itemId));
      setToastMessage("Item removed from wishlist");
      setShowToast(true);
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    }
  }, [user?._id]);

   <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />

  return (
 <DataContext.Provider
      value={{
        wishData,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        loading,
      }}
    >
      {children}

      {/* 🔹 Toast Notification */}
      <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
    </DataContext.Provider>
  );
};

export default DataProvider;