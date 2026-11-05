import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Fail loud in the console when the backend URL is missing:
// with it unset every API call silently goes nowhere and
// the app looks "broken" in ways that are hard to diagnose.
// (See Client/.env.example for the required variables.)
const backendURL = import.meta.env.VITE_BACKEND_URL;
if (!backendURL) {
  console.error(
    "VITE_BACKEND_URL is not set — API calls will fail. Copy Client/.env.example to Client/.env and fill it in."
  );
}

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const [User, setUser] = useState(false);
  const [isSeller, setisseller] = useState();
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cardItems, setCardItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  // True until the first /is-auth answer settles — pages
  // that gate on login (e.g. AddAddress) must wait for this
  // instead of bouncing a signed-in user on refresh.
  const [authLoading, setAuthLoading] = useState(true);

  //fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await api.get("/api/seller/is-auth");
      if (data.success) {
        setisseller(true);
      } else {
        setisseller(false);
      }
    } catch (error) {
      setisseller(false);
    }
  };
  //fetch user status , user data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        // The DB field is `cartItems` (with a t). This line
        // used to read `cardItems` (with a d), which is
        // always undefined — the saved server cart never
        // actually restored.
        setCardItem(data.user.cartItems || {});
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch all Product
  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product/list");
      const data = response.data;

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //add product to cart
  const addToCard = (itemId) => {
    let cartData = structuredClone(cardItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCardItem(cartData);
    toast.success("added to cart");
  };
  //update cart item quantity — a quantity of 0 (or less)
  //removes the entry instead of persisting a phantom item
  //that getCartCount would keep summing.
  const updateCardItem = (itemId, quantity) => {
    let cartData = structuredClone(cardItems);
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCardItem(cartData);
    toast.success("Cart Updated");
  };
  // remove product from card
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cardItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }

      setCardItem(cartData);
      toast.success("Item removed from cart 🛒");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSeller();
    fetchUser();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        // Send the key the server actually reads
        // (`cartItems`); the old `{cardItems}` payload was
        // silently ignored server-side, so carts never
        // persisted at all.
        const { data } = await api.post("/api/cart/update", { cartItems: cardItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (User) {
      updateCart();
    }
  }, [cardItems, User]);

  //totalcartamount
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cardItems) {
      totalCount += cardItems[item];
    }
    return totalCount;
  };

  //total cart
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cardItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (cardItems[items] > 0 && itemInfo) {
        totalAmount += itemInfo.offerPrice * cardItems[items];
      }
    }

    return Math.floor(totalAmount * 100) / 100; // Rounds to 2 decimal places
  };

  const value = { api, navigate, axios, fetchProducts, User, setUser, isSeller, setisseller, showUserLogin, setShowUserLogin, products, setProducts, currency, addToCard, updateCardItem, removeFromCart, cardItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, setCardItem, authLoading };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const userAppContext = () => {
  return useContext(AppContext);
};
