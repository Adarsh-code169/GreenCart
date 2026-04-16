const NewsLetter = () => {
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-3 mt-24 pb-14 px-4">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-800">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500 max-w-lg mb-6 leading-relaxed">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center max-w-lg w-full gap-3 sm:gap-0 h-auto sm:h-12 md:h-14">
                <input
                    className="border border-gray-200 rounded-xl sm:rounded-r-none h-12 sm:h-full border-r-0 outline-none w-full px-5 text-gray-600 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    type="email"
                    placeholder="Enter your email address"
                    required
                />
                <button type="submit" className="w-full sm:w-auto sm:px-10 h-12 sm:h-full text-white bg-primary hover:bg-primary-dull transition-all font-bold cursor-pointer rounded-xl sm:rounded-l-none shadow-lg shadow-primary/20">
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsLetter;