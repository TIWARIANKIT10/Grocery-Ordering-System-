import React from 'react'
import Navbar from './component/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import {Toaster} from "react-hot-toast"
import Footer from './component/Footer';
import { userAppContext } from './context/appContext';
import Login from './component/Login';
import AllProducts  from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductCard from './component/ProductCard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrder from './pages/MyOrder'
import  SellerLogin  from './component/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';

// App.jsx
function App() {
    const isSellerPath = useLocation().pathname.includes("seller");
    const{showUserLogin,isSeller} = userAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
        {isSellerPath? null:  <Navbar/> }
        {showUserLogin?<Login/>:null}
        <Toaster/>
     
    <div className={`${isSellerPath}?"":"px-6 md:px-16 lg:px_24 xl:px-32"`}>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/products/' element={<AllProducts/>}/>
    <Route path="/product/:category" element={<ProductCategory />} />
    <Route path="/products/:category/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart/>} />
    <Route path="/add-address" element={<AddAddress/>} />
     <Route path="/my-order" element={<MyOrder/>} />
      <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>


   </Routes>
    </div>
   {!isSellerPath && <Footer/>}
    </div>
  );
}


export default App;
