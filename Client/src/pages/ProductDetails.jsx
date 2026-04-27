import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ Missing import
import { userAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets";
import ProductCard from "../component/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCard } = userAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id); // ✅ .find not .filter

  useEffect(() => {
    if (product) {
      const productsCopy = products.filter((item) => item.category === product.category && item._id !== id);
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product, id]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] ?? null);
  }, [product]);

  if (!product) return <p className="mt-16 text-center text-gray-500">Product not found</p>;

  return (
    <div className="mt-16">
      <p className="text-sm md:text-base break-words">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category.toLowerCase()}`}>{product.category}</Link> /{" "}
        <span className="text-indigo-500">{product.name}</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-1">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border w-16 h-16 sm:w-20 sm:h-20 border-gray-500/30 rounded overflow-hidden cursor-pointer shrink-0"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 w-full sm:max-w-[28rem] rounded overflow-hidden">
            <img src={thumbnail} alt="Selected product" className="w-full h-auto object-cover" />
          </div>
        </div>

        <div className="text-sm w-full lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                  className="md:w-4 w-3.5"
                />
              ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
            <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center mt-8 gap-3 sm:gap-4 text-base">
            <button
              onClick={() => addToCard(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCard(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-20">
  <div className="flex flex-col items-center w-fit">
    <p className="text-3xl font-medium">Related Products</p>
    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
    {relatedProducts
      .filter((product) => product.inStock)
      .map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
  </div>

  <button
    onClick={() => {
      navigate('/products');
      scrollTo(0, 0);
    }}
    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
  >
    See more
  </button>
</div>

      
    </div>
  );
};

export default ProductDetails;
