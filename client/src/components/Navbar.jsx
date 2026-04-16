import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    isSeller,
    setShowSellerLogin,
  } = useAppContext();

  // ✅ Logout Function
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Search redirect
  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Product</NavLink>
        <button
          onClick={() => {
            if (isSeller) {
              navigate("/seller");
            } else {
              setShowSellerLogin(true);
            }
          }}
          className="px-6 py-1 border border-gray-300 rounded-full hover:bg-gray-200 transition-all duration-200"
        >
          Seller Dashboard
        </button>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* User Section */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 cursor-pointer"
              alt=""
            />

            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>

              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Section */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:hidden'}`} onClick={() => setOpen(false)}></div>

      {/* Mobile Dropdown Panel */}
      <div className={`fixed top-0 bottom-0 right-0 w-64 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out transform ${open ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex justify-end p-5">
          <button onClick={() => setOpen(false)} className="p-2">
            <img src={assets.cross_icon} className="w-5" alt="close" />
          </button>
        </div>
        
        <div className="flex flex-col gap-1 px-5 text-gray-600">
          <NavLink to="/" onClick={() => setOpen(false)} className="py-2 pl-4 border-b">Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className="py-2 pl-4 border-b">All Product</NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)} className="py-2 pl-4 border-b">My Orders</NavLink>
          )}
          <NavLink to="/" onClick={() => setOpen(false)} className="py-2 pl-4 border-b">Contact</NavLink>
          
          <button
            onClick={() => {
              setOpen(false);
              if (isSeller) {
                navigate("/seller");
              } else {
                setShowSellerLogin(true);
              }
            }}
            className="py-2 pl-4 text-left border-b"
          >
            Seller Dashboard
          </button>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-center"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
