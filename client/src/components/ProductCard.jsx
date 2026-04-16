import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';


const ProductCard = ({ product }) => {

    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    return product && (
        <div 
            onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} 
            className="group relative border border-gray-100 rounded-2xl p-4 bg-white hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden cursor-pointer"
        >
            {/* Quick View Overlay Tag */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/10 backdrop-blur-md p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
            </div>

            <div className="flex items-center justify-center p-4">
                <img className="group-hover:scale-110 transition-transform duration-500 w-full max-w-[140px] h-32 object-contain" src={product.image[0]} alt={product.name} />
            </div>

            <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{product.category}</span>
                <p className="text-gray-800 font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} className='w-3 h-3' src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt='' />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">(4.0)</span>
                </div>

                <div className="flex items-center justify-between pt-3">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 line-through leading-none">{currency}{product.price}</span>
                        <span className="text-lg font-black text-primary leading-tight">{currency}{product.offerPrice}</span>
                    </div>

                    <div onClick={(e) => { e.stopPropagation() }}>
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dull transition-all active:scale-95 shadow-md shadow-primary/20" 
                                onClick={() => addToCart(product._id)} 
                            >
                                <img src={assets.cart_icon} className="w-3 invert" alt='cart_icon' />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-3 px-2 py-1.5 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                                <button onClick={() => { removeFromCart(product._id) }} className="hover:text-primary transition-colors font-bold px-1" >
                                    -
                                </button>
                                <span className="w-4 text-center text-xs font-bold text-gray-700">{cartItems[product._id]}</span>
                                <button onClick={() => { addToCart(product._id) }} className="hover:text-primary transition-colors font-bold px-1" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;