import React, { useState } from 'react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`relative flex flex-col flex-wrap bg-white border-r border-gray-500 
                p-6 flex-none w-64 ${isOpen ? 'md:ml-0' : 'md:-ml-64'} md:fixed md:top-0 md:z-40 
                md:h-screen md:shadow-xl animated faster`}>
                {/* sidebar content */}
                <div className="flex flex-col">
                    <p className="uppercase text-xs text-gray-600 mb-4 tracking-wider">Navigation</p>
                    {/* links */}
                    <a href="#home" className="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                        <i className="fad fa-home text-xs mr-2"></i>
                        Home
                    </a>
                    <a href="#about" className="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                        <i className="fad fa-info-circle text-xs mr-2"></i>
                        About
                    </a>
                    <a href="#services" className="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                        <i className="fad fa-cogs text-xs mr-2"></i>
                        Services
                    </a>
                    <a href="#contact" className="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                        <i className="fad fa-envelope text-xs mr-2"></i>
                        Contact
                    </a>
                    {/* end links */}
                </div>
                {/* sidebar toggle */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-1/2 right-3 transform translate-x-full -translate-y-1/2 
                    bg-gray-600 text-white p-2 shadow-lg hover:bg-teal-700 transition ease-in-out 
                    duration-300 rounded-full"
                >
                    <i className={`fa fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
                </button>
                {/* end sidebar toggle */}
            </div>
        </>
    );
}