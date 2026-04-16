import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {

    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    // ✅ FIXED ERROR → relatedProducts was missing
    const relatedProducts = products.filter(
        (item) =>
            item.category === product?.category &&
            item._id !== product?._id
    );

    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    return product ? (
        <div className="mt-8 md:mt-12">
            <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
                <Link to={"/"} className="hover:text-primary transition">Home</Link>
                <span>/</span>
                <Link to={"/products"} className="hover:text-primary transition">Products</Link>
                <span>/</span>
                <Link to={`/product-category/${product.category}`} className="hover:text-primary transition whitespace-nowrap">{product.category}</Link>
                <span>/</span>
                <span className="text-primary font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mt-6">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-1/2 lg:w-[45%]">
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] no-scrollbar py-1">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className={`border min-w-[80px] sm:max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer transition-all ${thumbnail === image ? 'ring-2 ring-primary' : ''}`} >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 w-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={thumbnail} alt="Selected product" className="w-full h-auto max-h-[500px] object-contain transition-all duration-300" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2 lg:w-[55%]">
                    <h1 className="text-2xl sm:text-3xl font-medium text-gray-800">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-2">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3.5 sm:w-4" />
                        ))}
                        <p className="text-sm sm:text-base ml-2 text-gray-500">(4 reviews)</p>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-gray-400 line-through text-sm">MRP: {currency}{product.price}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-3xl font-bold text-gray-900">{currency}{product.offerPrice}</p>
                            <span className="text-green-600 font-medium text-sm">
                                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">(inclusive of all taxes)</p>
                    </div>

                    <div className="mt-8">
                        <p className="text-base font-semibold text-gray-800">About Product</p>
                        <ul className="list-disc ml-5 mt-3 space-y-2 text-gray-600 leading-relaxed">
                            {product.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mt-10 gap-4 w-full">
                        <button onClick={() => addToCart(product._id)} className="w-full py-4 cursor-pointer font-semibold bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-full transition shadow-sm" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-4 cursor-pointer font-semibold bg-primary text-white hover:bg-primary-dull rounded-full transition shadow-md" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-2xl sm:text-3xl font-medium text-gray-800">Related Products</p>
                    <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-10 gap-3 sm:gap-6 w-full">
                    {relatedProducts.filter((product)=>product.inStock).map((product,index)=>(
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>

                <button onClick={()=>{navigate('/products'); scrollTo(0,0)}} className="mx-auto cursor-pointer px-10 py-3 mt-12 border-2 border-primary/20 rounded-full text-primary font-medium hover:bg-primary hover:text-white transition-all shadow-sm">
                    View More Products
                </button>
            </div>

        </div>
    ) : <div className="mt-20 text-center">Loading...</div>;
};

export default ProductDetail;
