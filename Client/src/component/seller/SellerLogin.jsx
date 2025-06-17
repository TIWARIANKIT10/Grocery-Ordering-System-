import React, { useEffect, useState } from 'react'
import { userAppContext } from '../../context/appContext'

 const SellerLogin = () => {
    const {isSeller,setisseller,navigate} = userAppContext()
    const[email,setEmail] = useState("");
    const [password, setpassword] =useState("");

   const  onSubmitHandler = async (event)=>{
    event.preventDefault();
    setisseller(true)

   }

        useEffect(()=>{
            if(isSeller){
                navigate("/seller")
            }
        },[isSeller])
    
  return !isSeller && (
    <form action="" onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
    <p className="text-2xl font-medium m-auto">
        <span className="text-primary">Seller</span> Login
    </p>
    
    <div className="w-full">
        <p>Email</p>
        <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email" 
            placeholder="enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
        />
    </div>
    
    <div className="w-full">
        <p>Password</p>
        <input onChange={(e)=>setpassword(e.target.value)} value={password}
            type="password" 
            placeholder="enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
        />
    </div>
    
    <button 
        type="submit" 
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
    >
        Login
    </button>
    
    <p className="text-sm text-gray-600 m-auto">
        Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
    </p>
</div>

    </form>
  )
}
export default SellerLogin
