import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const FlashSale = () => {
    const { products, currency, navigate, addToCart } = useAppContext();
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 0,
    });

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(timer);
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Pick unique products from different categories with the best offers
    const flashSaleProducts = (() => {
        const categoryMap = new Map();
        
        // Group by category and keep the one with the biggest discount
        products.forEach(product => {
            const discount = (product.price - product.offerPrice) / product.price;
            if (!categoryMap.has(product.category) || discount > categoryMap.get(product.category).discount) {
                categoryMap.set(product.category, { product, discount });
            }
        });

        // Get the products and sort by absolute discount value to keep it "flashy"
        return Array.from(categoryMap.values())
            .map(item => item.product)
            .sort((a, b) => (b.price - b.offerPrice) - (a.price - a.offerPrice))
            .slice(0, 6);
    })();

    const pad = (num) => String(num).padStart(2, "0");

    return (
        <div className="mt-16 md:mt-24 relative overflow-hidden rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 px-6 py-12 md:px-12 md:py-16">
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600 border border-red-200 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        LIVE FLASH SALE
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                        Lightning <span className="text-primary">Deals</span>
                    </h2>
                    <p className="max-w-md mx-auto lg:mx-0 text-gray-500 text-lg">
                        Get up to 50% off on daily essentials. Grab them before the clock runs out!
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex justify-center lg:justify-start items-center gap-4 mt-8">
                        {[
                            { label: "Hrs", val: timeLeft.hours },
                            { label: "Min", val: timeLeft.minutes },
                            { label: "Sec", val: timeLeft.seconds },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-200 text-3xl font-mono font-black text-primary shadow-sm">
                                    {pad(item.val)}
                                </div>
                                <span className="mt-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden -mx-4 lg:mx-0 relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-emerald-50/50 to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-emerald-50/50 to-transparent"></div>

                    {/* Marquee Track */}
                    <div className="flex gap-6 pb-4 flash-marquee">
                        {/* Render twice for seamless loop */}
                        {[...flashSaleProducts, ...flashSaleProducts].map((product, idx) => (
                            <div 
                                key={`${product._id}-${idx}`} 
                                onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                                className="w-56 flex-shrink-0 group relative transition-all duration-500 hover:-translate-y-2 hover:[animation-play-state:paused] cursor-pointer"
                            >
                                <div className="absolute top-4 left-4 z-20 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-black text-white shadow-md">
                                    -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                                </div>
                                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm group-hover:border-primary/30 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-center h-36">
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{product.category}</p>
                                        <h3 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-primary">{currency}{product.offerPrice}</span>
                                            <span className="text-xs font-bold text-gray-400 line-through">{currency}{product.price}</span>
                                        </div>

                                        {/* Stock Progress Bar */}
                                        <div className="mt-4 space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                                                <span>Selling Fast</span>
                                                <span className="text-red-500">85% Sold</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div className="h-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                                        className="mt-5 w-full rounded-xl bg-primary/10 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
                                    >
                                        Grab Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes flash-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .flash-marquee {
                    animation: flash-scroll 25s linear infinite;
                    width: max-content;
                }
                .flash-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </div>
    );
};

export default FlashSale;
