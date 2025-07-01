import React, { useEffect, useState } from 'react'
import { userAppContext } from '../context/AppContext.jsx'
import ProductCard from '../component/ProductCard'

 const AllProducts = () => {
    const {products,searchQuery} = userAppContext()
    const [filterProducts,setFilteredProducts] = useState([])
    useEffect(()=>{
      if(searchQuery.length>0 ){
        setFilteredProducts(products.filter(
          products => products.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      }
      else{
        setFilteredProducts(products)
      }
    },[products,searchQuery])
  return (
   <div className='mt-16 flex flex-col'>
  <div className='flex flex-col items-end w-max'>
    <p className='text-2xl font-medium uppercase'>All products</p>
    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
  </div>

  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
    {filterProducts.filter((product) => product.inStock).map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
</div>
  )
}
export default AllProducts;
