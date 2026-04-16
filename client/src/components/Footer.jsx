import { footerLinks } from "../assets/assets";
import { assets } from "../assets/assets";

const Footer = () => {
    
    return (
        <div className="px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12 py-12 border-b border-gray-500/30 text-gray-500">
                <div className="w-full lg:w-1/2">
                    <img className="w-40" src={assets.logo} alt="logo" />
                    <p className="max-w-md mt-6 leading-relaxed">
                        We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-1/2">
                    {footerLinks.map((section, index) => (
                        <div key={index} className="flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-4">{section.title}</h3>
                            <ul className="text-sm space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:text-primary transition-colors whitespace-nowrap">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-6 text-center text-xs sm:text-sm text-gray-400">
                Copyright © {new Date().getFullYear()} GreenCart. All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;