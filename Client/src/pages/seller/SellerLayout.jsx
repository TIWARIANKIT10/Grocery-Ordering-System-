import { NavLink, Outlet, Link, Navigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { userAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { setisseller,axios,navigate,api } = userAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
   try {
    const {data} = await api.get('/api/seller/logout')
    if(data.success){
      toast.success(data.message);
      navigate('/')
    }else{
      toast.error(data.message)
    }
   } catch (error) {
     toast.error(error.message)
    
   }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-34 md:w-38" />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button onClick={logout} className="border rounded-full text-sm px-4 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 w-full md:min-h-[calc(100vh-68px)] border-r text-base border-gray-300 pt-2 md:pt-4 flex md:flex-col overflow-x-auto md:overflow-visible">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 shrink-0 ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                    : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-7 h-7" />
              <p className="text-center whitespace-nowrap">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Main content goes here */}
        <div className="flex-1 p-3 sm:p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
