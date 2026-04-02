/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// ✅ Axios Config (IMPORTANT)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (error) {
      setIsSeller(false);
      console.error(error);
    }
  };

  // ✅ FETCH USER
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user?.cartItems || {});
      }
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ CART FUNCTIONS
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId]--;

      if (cartData[itemId] === 0) delete cartData[itemId];

      setCartItems(cartData);
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);

      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchSeller();
      await fetchProducts();
    };
    init();
  }, []);

  // ✅ SYNC CART
  useEffect(() => {
    if (user) {
      axios.post("/api/cart/update", {
        userId: user._id,
        cartItems,
      });
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
