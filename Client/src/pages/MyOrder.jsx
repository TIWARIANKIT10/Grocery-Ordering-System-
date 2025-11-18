import React, { useEffect, useState } from "react";
import { assets, dummyOrders } from "../assets/assets";
import { Link } from "react-router-dom";
import { userAppContext } from "../context/AppContext.jsx";

const MyOrder = () => {
  const [myOrders,setMyOrders] = useState([])
  const {axios,User,currency,api} = userAppContext();
  const fetchMyOrder = async ()=> { 
    try {
      const { data} = await api.get('/api/order/user')
      console.log(data )

      
      if(data.success){
        setMyOrders(data.orders)

      }
      
    } catch (error) {
      console.log(error)
      
    }
  
  }
  useEffect(()=>{
    if(User){
    fetchMyOrder()}
  },[User])
  return (
    <div className="mt-16 px-4">
      <h1 className="text-2xl font-semibold mb-8 border-b pb-2 w-max">
        MY ORDERS
      </h1>

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm max-w-4xl"
        > 
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId : {order._id}</span>
            <span>Payment : {order.paymentType}</span>
            <span>Total Amount : {currency}{order.amount}</span>
          </p>
<p>hellow</p>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-white text-gray-500/70 ${
                order.items.length !== idx + 1 ? "border-b" : ""
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img
                    src={item?.product?.image?.[0] || assets.no_image}
                    alt=""
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {item?.product?.name || "Unknown Product"}
                  </h2>
                  <p>Category: {item?.product?.category || "N/A"}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <p className="text-primary text-lg font-medium">
                Amount: {currency}
                {item?.product?.offerPrice
                  ? item.product.offerPrice * item.quantity
                  : 0}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
