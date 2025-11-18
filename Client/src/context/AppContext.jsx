import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';


export const AppContext = createContext();

const api = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL ,
  withCredentials:true
})



export const AppContextProvider = ({ children }) => {
  const currency = import.meta.VITE_CURRENCY;
  const navigate = useNavigate();
  const [User, setUser] = useState(false);
  const [isSeller, setisseller] = useState();
  const [showUserLogin , setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cardItems, setCardItem] = useState({});
  const [searchQuery, setSearchQuery] = useState({});


  //fetch seller status
  const fetchSeller = async ()=>{
    try {
      const {data} = await api.get('/api/seller/is-auth')
      if(data.success){
        setisseller(true)
      }
      else{
        setisseller(false)
      }
    } catch (error) {
      setisseller(false);

      
    }
  }
  //fetch user status , user data and cart items 
  const fetchUser = async ()=>{
  try {
    const {data} = await api.get('/api/user/is-auth');
    if(data.success){
      setUser(data.user)
    setCardItem(data.user.cardItems || {});

    }
  } catch (error) {
    setUser(null)
    
  }
  }

  // Fetch all Product
  const fetchProducts = async()=>{
    try {
      const response  = await api.get('/api/product/list')
      const data = response.data;
     
      if(data.success){
        setProducts(data.products)
     
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
       toast.error(error.message)
      
    }
   
  }

  //add product to cart 
  const addToCard = (itemId)=>{
    let cartData = structuredClone(cardItems);
    if(cartData[itemId]){
      cartData[itemId] +=1;

    }
    else{
      cartData[itemId]=1;
    }
    setCardItem(cartData);
    toast.success("added to cart")
  }
  //update cart item quantity
  const updateCardItem = (itemId,quantity)=>{
    let cartData = structuredClone(cardItems);
    cartData[itemId]= quantity;
    setCardItem(cartData)
    toast.success("Cart Updated");
  }
 // remove product from card 
const removeFromCart = (itemId) => {
  console.log("Removing item:", itemId);
  let cartData = structuredClone(cardItems);

  if (cartData[itemId]) {
    cartData[itemId] -= 1;

    if (cartData[itemId] === 0) {
      delete cartData[itemId];
    }

    setCardItem(cartData); // ✅ Missing this
     toast.success("Item removed from cart 🛒");
  }
};


  useEffect(()=>{
    fetchProducts()
    fetchSeller()
    fetchProducts()
    fetchUser()
  },[])

  useEffect(() => {
  const updateCart = async ()=>{
    try {
      console.log(cardItems)
      const { data } = await api.post('/api/cart/update', {cardItems});
     
      if (!data.success) {
        toast.error(data.message);
        
      }
      console.log(data.success+"hh")
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (User) {
    updateCart(); // ✅ only called once, conditionally
  }
}, [cardItems,User]); // 🔁 Also include `User` as dependency

 
  //totalcartamount
  const getCartCount = ()=>{
    let totalCount = 0;
    for (const item in cardItems){
      totalCount += cardItems[item];
    }
    return totalCount;
  }

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





  const value = {api,navigate,axios, fetchProducts,User, setUser, isSeller, setisseller, showUserLogin, setShowUserLogin ,products,setProducts,currency, addToCard ,updateCardItem,removeFromCart,cardItems,searchQuery, setSearchQuery,getCartAmount,getCartCount,setCardItem};

  // ✅ Fixed: use AppContext.Provider here
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};


export const userAppContext = () => {
  return useContext(AppContext);
};
