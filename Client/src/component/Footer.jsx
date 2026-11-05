import React from "react";
import { assets, footerLinks } from "../assets/assets";

const Footer  = () => {
    

    return (
        <div id="contact" className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-16 md:mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="Grocery Ordering System logo" />
                    <p className="max-w-[410px] mt-6">Fresh groceries delivered to your door. Shop everyday essentials, fresh produce, dairy, snacks and household items at honest prices, and get them delivered fast.
                    </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © Team Ankit All Right Reserved.
            </p>
        </div>
    );
};
export default Footer
