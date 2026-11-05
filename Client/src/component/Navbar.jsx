
import React, { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { userAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

function Navbar ()  {
     const [open, setOpen] = React.useState(false)
     const {User, setUser,api, setShowUserLogin,searchQuery, setSearchQuery,getCartCount} = userAppContext();

     const navigate = useNavigate();
     const location = useLocation();

     const logout = async ()=>{
        try {
            const {data} = await api.get('/api/user/logout')
            if(data.success){
                toast.success("Logout Sucess")
                 setUser(null);
                      navigate('/')
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }

     }

     // Close the mobile drawer whenever the route changes
     useEffect(()=>{
        setOpen(false)
     },[location.pathname])

     // Close the mobile drawer with the Escape key
     useEffect(()=>{
        if(!open) return
        const onKeyDown = (e)=>{ if(e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKeyDown)
        return ()=> window.removeEventListener('keydown', onKeyDown)
     },[open ])

     useEffect(()=>{
        if(searchQuery && searchQuery.length >0){
            navigate("/products")
        }
     },[searchQuery])

     const onMobileSearch = (e)=>{
        e.preventDefault()
        setOpen(false)
        navigate("/products")
     }


  return (
   <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-4 border-b border-gray-300 bg-white transition-all">

            <NavLink to='/' onClick={()=>setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="Grocery Ordering System logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-5 lg:gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>All Product</NavLink>
                <a href='#contact'>Contact</a>

                <div className="hidden lg:flex items-center text-base gap-2 border border-gray-300 px-3 rounded-full max-w-64">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div className="relative cursor-pointer" onClick={()=> navigate("/cart")} >
                   <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">{getCartCount()}</span>
                </div>

                {!User ? (
                    <button onClick={()=>{setShowUserLogin(true)}} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>):
                (<div className='relative group '>
                    <img src={assets.profile_icon} alt="" className='w-10' />
                    <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                        <li onClick={()=>{
                            navigate("my-order")
                        }}
                        className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Order</li>
                        <li  onClick={logout}
                        className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                    </ul>

                </div>)}
            </div>
<div className='flex items-center gap-2 sm:hidden'>

                <div className="relative cursor-pointer p-2" onClick={()=> navigate("/cart")} >
                   <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <span className="absolute top-0 right-0 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">{getCartCount()}</span>
                </div>
                <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="sm:hidden inline-flex items-center justify-center w-11 h-11 p-2.5 rounded-full hover:bg-gray-100 cursor-pointer">
                {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6"><path d="M18 6 6 18M6 6l12 12"/></svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
            </button>
</div>

            {/* Mobile Menu */}
            { open &&(
            <div className="absolute top-full left-0 z-50 w-full bg-white shadow-md border-t border-gray-100 py-4 flex flex-col items-stretch gap-1 px-5 text-base sm:hidden">
                <form onSubmit={onMobileSearch} className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1 mb-2">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-base" type="text" placeholder="Search products" aria-label="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4 shrink-0' />
                </form>
                <NavLink className="py-2" to="/" onClick={()=>setOpen(false)}>Home</NavLink>
                <NavLink className="py-2" to="/products" onClick={()=>setOpen(false)}>All Product</NavLink>
                {User &&
                <NavLink className="py-2" to="/my-order" onClick={()=>setOpen(false)}>My Orders</NavLink> }

                 <a className="py-2" href="#contact" onClick={()=>setOpen(false)}>Contact</a>
                 {!User ? ( <button onClick={()=>{setOpen(false); setShowUserLogin(true);}} className="cursor-pointer px-6 py-2.5 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-base self-start">
                    Login
                </button>):( <button onClick={()=>{setOpen(false); logout();}} className="cursor-pointer px-6 py-2.5 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-base self-start">
                    Logout
                </button>) }

            </div> )}

        </nav>
  )
}

export default Navbar
