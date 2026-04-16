import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    console.log("Cart Items: ", cartItems);
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      console.log("Product for key ", key, ": ", product);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get", {
        params: { userId: user._id },
      });

      if (data.success) {
        setAddresses(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select a delivery address");
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/order-placed");
        } else {
          toast.error(data.message);
        }
      } else {
        //place order with stripe

        const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items: cartArray.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      (async () => {
        getUserAddress();
      })();
    }
  }, [user]);

  // const [showAddress, setShowAddress] = useState(false)

  const FREE_SHIPPING_THRESHOLD = 100;
  const cartAmount = getCartAmount();
  const shippingProgress = Math.min((cartAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cartAmount, 0);

  return products.length > 0 && cartItems ? (
    <div className="mt-8 md:mt-16 pb-20 px-4 sm:px-0">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: Cart Items */}
        <div className="flex-1 w-full">
          {cartArray.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Your Cart
                </h1>
                <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    <span className="text-primary font-bold text-sm tracking-wide">{getCartCount()} items</span>
                </div>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className="p-2 bg-emerald-50 rounded-xl">🚚</span>
                        <p className="font-bold text-gray-800">
                          {remainingForFreeShipping > 0 
                            ? `Only ${currency}${remainingForFreeShipping.toFixed(2)} more for FREE Shipping!` 
                            : "Yay! You've unlocked FREE Shipping! 🥳"}
                        </p>
                    </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-1000 ease-out" 
                        style={{ width: `${shippingProgress}%` }}
                    ></div>
                </div>
              </div>

              {/* Desktop Headers */}
              <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_auto] text-xs font-black uppercase tracking-widest text-gray-400 pb-4 border-b border-gray-100 px-4">
                <p>Product</p>
                <p>Name</p>
                <p className="text-center">Quantity</p>
                <p className="text-right">Price</p>
                <div className="w-10"></div>
              </div>

              <div className="space-y-4 mt-6">
                {cartArray.map((product, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-50 rounded-3xl p-4 md:p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:border-primary/20"
                  >
                    <div className="flex flex-wrap md:grid md:grid-cols-[1fr_2fr_1fr_1fr_auto] items-center gap-4 md:gap-6">
                      {/* Product Image */}
                      <div
                        onClick={() => {
                          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                          scrollTo(0, 0);
                        }}
                        className="cursor-pointer w-24 h-24 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden group-hover:scale-95 transition-transform duration-500"
                      >
                        <img
                          className="max-w-[80%] max-h-[80%] object-contain"
                          src={product.image[0]}
                          alt={product.name}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-[150px]">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-1">{product.category}</p>
                        <p className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Weight: {product.weight || "N/A"}</p>
                      </div>

                      {/* Quantity Select */}
                      <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                        <select
                          onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                          value={cartItems[product._id]}
                          className="bg-transparent outline-none text-gray-700 font-black text-sm cursor-pointer px-2"
                        >
                          {Array(Math.max(cartItems[product._id], 10)).fill("").map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      {/* Subtotal */}
                      <p className="flex-1 md:flex-none text-right font-black text-gray-900 text-lg">
                        {currency}{(product.offerPrice * product.quantity).toFixed(2)}
                      </p>

                      {/* Action */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button
                    onClick={() => { navigate("/products"); scrollTo(0, 0); }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 hover:text-primary transition-all active:scale-95 border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Continue Shopping
                </button>
              </div>
            </>
          ) : (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-white border border-dashed border-gray-200 rounded-[3rem]">
                <div className="w-32 h-32 bg-gray-50 flex items-center justify-center rounded-full text-5xl animate-bounce">
                    🛒
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900">Your cart is empty!</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find some fresh essentials!</p>
                </div>
                <button 
                    onClick={() => { navigate("/products"); scrollTo(0, 0); }}
                    className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dull hover:-translate-y-1 transition-all active:scale-95"
                >
                    Start Shopping
                </button>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        {cartArray.length > 0 && (
          <div className="lg:w-[420px] w-full shrink-0 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Summary</h2>
              
              <div className="space-y-8">
                {/* Address Selection */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery To</p>
                    {selectedAddress && (
                        <button 
                            onClick={() => setShowAddress(!showAddress)} 
                            className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer"
                        >
                            Change
                        </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    {selectedAddress ? (
                        <div 
                            onClick={() => setShowAddress(!showAddress)} 
                            className="bg-gray-50 rounded-[1.25rem] p-4 border border-gray-100 group-hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <p className="text-sm font-bold text-gray-700 leading-snug">
                                {`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`}
                            </p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                if (addresses.length > 0) {
                                    setShowAddress(!showAddress);
                                } else {
                                    navigate("/add-address");
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-primary/5 border-2 border-dashed border-primary/20 py-4 rounded-[1.25rem] text-primary font-bold hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group"
                        >
                            <span className="text-xl">+</span>
                            Add Delivery Address
                        </button>
                    )}

                    {showAddress && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                          {addresses.length > 0 ? (
                            addresses.map((address, index) => (
                              <div
                                onClick={() => { setSelectedAddress(address); setShowAddress(false); }}
                                className={`p-4 rounded-xl text-sm font-bold cursor-pointer transition-all ${selectedAddress?._id === address._id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                key={index}
                              >
                                {address.street}, {address.city}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400 text-xs font-medium italic">
                                No addresses found
                            </div>
                          )}
                          <Link 
                            to="/add-address" 
                            onClick={(e) => {
                                if (!user) {
                                    e.preventDefault();
                                    setShowUserLogin(true);
                                    toast.error("Please login first to add an address");
                                }
                            }}
                            className="flex items-center justify-center gap-2 py-4 text-primary font-black text-sm hover:bg-primary/5 transition-all rounded-xl border-t border-gray-50 mt-2"
                          >
                             + Add New Address
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Options */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                      {["COD", "Online"].map(method => (
                          <button 
                            key={method}
                            onClick={() => setPaymentOption(method)}
                            className={`py-3 rounded-[1.25rem] font-black text-sm transition-all border ${paymentOption === method ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/30'}`}
                          >
                            {method === "COD" ? "Cash" : "Card"}
                          </button>
                      ))}
                  </div>
                </div>

                {/* Bill Details */}
                <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-gray-100 shadow-inner">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{currency}{cartAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-500">Shipping</span>
                    <span className={remainingForFreeShipping === 0 ? "text-emerald-500" : "text-gray-900"}>
                        {remainingForFreeShipping === 0 ? "FREE" : `${currency}10.00`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-500">Estimated Tax</span>
                    <span className="text-gray-900">{currency}{(cartAmount * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 border-dashed flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                        <span className="text-3xl font-black text-primary">{currency}{(cartAmount + (remainingForFreeShipping === 0 ? 0 : 10) + (cartAmount * 0.02)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="space-y-4">
                    <button
                        onClick={placeOrder}
                        className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary-dull hover:-translate-y-1 transition-all active:scale-95 group overflow-hidden relative"
                    >
                        <span className="relative z-10">{paymentOption === "COD" ? "Complete Order" : "Pay Securely"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Checkout</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
      /* Loading State */
      <div className="h-96 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
  );
};

export default Cart;
