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

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col lg:flex-row mt-8 md:mt-16 gap-10">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary font-normal ml-2">{getCartCount()} Items</span>
        </h1>

        {/* Desktop Headers */}
        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] text-gray-500 text-sm font-medium pb-4 border-b border-gray-100">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-right pr-4">Action</p>
        </div>

        <div className="divide-y divide-gray-100">
          {cartArray.map((product, index) => (
            <div
              key={index}
              className="py-6 flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr] md:items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  <img
                    className="max-w-full max-h-full object-contain p-2"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <p>Weight: <span className="text-gray-700">{product.weight || "N/A"}</span></p>
                    <div className="flex items-center gap-2">
                      <span>Qty:</span>
                      <select
                        onChange={(e) =>
                          updateCartItem(product._id, Number(e.target.value))
                        }
                        value={cartItems[product._id]}
                        className="bg-gray-50 border border-gray-200 rounded px-1 outline-none text-gray-700 font-medium cursor-pointer"
                      >
                        {Array(
                          cartItems[product._id] > 9 ? cartItems[product._id] : 9
                        )
                          .fill("")
                          .map((_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  {/* Mobile-only Price */}
                  <p className="md:hidden mt-2 font-bold text-primary">
                    {currency}{product.price * product.quantity}
                  </p>
                </div>
              </div>

              {/* Desktop-only Price */}
              <p className="hidden md:block text-center font-bold text-gray-800">
                {currency}{product.price * product.quantity}
              </p>

              {/* Action Button */}
              <div className="flex justify-end md:justify-center">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors group cursor-pointer"
                  title="Remove item"
                >
                  <img
                    src={assets.remove_icon}
                    alt="remove"
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group flex items-center mt-10 gap-2 text-primary font-medium hover:underline transition-all cursor-pointer"
        >
          <img src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary Side Panel */}
      <div className="lg:w-[380px] w-full shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Address</p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  {selectedAddress ? "Change" : "Add"}
                </button>
              </div>
              
              <div className="relative">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedAddress
                      ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                      : "No address found"}
                  </p>
                </div>

                {showAddress && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                      {addresses.map((address, index) => (
                        <div
                          onClick={() => {
                            setSelectedAddress(address);
                            setShowAddress(false);
                          }}
                          className={`p-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedAddress?._id === address._id ? 'bg-primary/5 text-primary' : 'text-gray-600'}`}
                          key={index}
                        >
                          {address.street}, {address.city}, {address.state}, {address.country}
                        </div>
                      ))}
                      <Link
                        to="/add-address"
                        onClick={(e) => {
                          if (!user) {
                            e.preventDefault();
                            setShowUserLogin(true);
                            toast.error("Please login first to add an address");
                          }
                        }}
                        className="block text-primary text-center font-semibold p-3 hover:bg-primary/10 transition-colors text-sm"
                      >
                        + Add New Address
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Method</p>
              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-primary/30 transition-colors appearance-none"
                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em'}}
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{currency}{getCartAmount()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (2%)</span>
                <span>{currency}{(getCartAmount() * 2) / 100}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-50 border-dashed">
                <span>Total Amount</span>
                <span className="text-primary">{currency}{getCartAmount() + (getCartAmount() * 2) / 100}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dull hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer mt-4"
            >
              {paymentOption === "COD" ? "Place Order" : "Proceed to Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Cart;
