import React from 'react';
import { useParams } from 'react-router-dom'; // ✅ Missing import
import { userAppContext } from '../context/AppContext.jsx';
import { categories } from '../assets/assets';
import ProductCard from '../component/ProductCard'; // ✅ Assuming you want to display product cards

const ProductCategory = () => {
  const { products } = userAppContext();
  const { category } = useParams(); // ✅ gets route param like "fruits", "meat" etc.

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className='mt-16'>
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
          <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ProductCategory;



