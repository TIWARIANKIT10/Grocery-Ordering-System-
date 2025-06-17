import React from "react";
import { assets, dummyOrders } from "../assets/assets";
import { Link } from "react-router-dom";

const MyOrder = () => {
  return (
    <div className="mt-16 px-4">
      <h1 className="text-2xl font-semibold mb-8 border-b pb-2 w-max">
        MY ORDERS
      </h1>

      {dummyOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-md p-4 mb-6 shadow-sm"
        >
          <div className="flex justify-between items-start flex-wrap">
            <p className="text-gray-500 text-sm">
              <span className="text-gray-800 font-medium">OrderId :</span> {order._id}
            </p>
            <p className="text-gray-500 text-sm">
              <span className="text-gray-800 font-medium">Payment :</span>{" "}
              {order.paymentType}
            </p>
            <p className="text-gray-500 text-sm">
              <span className="text-gray-800 font-medium">Total Amount :</span>{" "}
              ${order.amount}
            </p>
          </div>

          <div className="border-t mt-4 pt-4 flex flex-col gap-4">
            {order.items.map(({ product, quantity }) => (
              <div key={product._id} className="flex gap-4 items-center">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity : {quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status : {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date : {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-green-600 font-medium whitespace-nowrap">
                  Amount: ${product.offerPrice * quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
