import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const FlashSale = () => {
    const { products, currency } = useAppContext();
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
        <div className="mt-20 relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 md:px-12 md:py-16 text-white shadow-2xl">
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 border border-red-500/20 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        LIVE FLASH SALE
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Midnight <span className="text-primary">Grocer</span> Deals
                    </h2>
                    <p className="max-w-md mx-auto lg:mx-0 text-slate-400 text-lg">
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
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 text-3xl font-mono font-bold text-primary shadow-inner">
                                    {pad(item.val)}
                                </div>
                                <span className="mt-2 text-xs uppercase tracking-widest text-slate-500 font-bold">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div className="flex gap-6 w-max">
                        {flashSaleProducts.map((product) => (
                            <div key={product._id} className="w-64 group relative transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute top-4 left-4 z-20 rounded-lg bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                    -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:bg-slate-800/60 transition-colors">
                                    <img 
                                        src={product.image[0]} 
                                        alt={product.name} 
                                        className="h-40 w-full object-contain mb-4 transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <h3 className="font-bold text-slate-200 line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xl font-bold text-primary">{currency}{product.offerPrice}</span>
                                        <span className="text-sm text-slate-500 line-through">{currency}{product.price}</span>
                                    </div>
                                    
                                    {/* Stock Progress Bar */}
                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            <span>Selling Fast</span>
                                            <span className="text-red-400">85% Sold</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                                            <div className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-1000" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <button className="mt-5 w-full rounded-xl bg-white py-2 text-sm font-bold text-slate-900 transition-all hover:bg-primary hover:text-white">
                                        Grab Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default FlashSale;
