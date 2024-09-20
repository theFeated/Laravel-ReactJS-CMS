import React, { useState, useEffect, useRef } from 'react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarState');
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    const timeoutRef = useRef(null);

    const toggleSidebar = () => {
        setIsOpen((prevState) => {
            const newState = !prevState;
            localStorage.setItem('sidebarState', JSON.stringify(newState));
            return newState;
        });
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            localStorage.setItem('sidebarState', JSON.stringify(false));
        }, 500);
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    return (
        <div
            className={`relative flex flex-col flex-wrap bg-gray-100 dark:bg-gray-900 border-r border-gray-500 
                p-6 flex-none w-64 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:fixed md:top-0 md:z-40 md:h-screen md:shadow-xl`}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <div className="flex flex-col">
                <p className="uppercase text-xs text-gray-200 mb-4 tracking-wider">Navigation</p>
                <div className="mb-3 capitalize font-medium text-sm text-gray-400 hover:text-gray-100 transition ease-in-out duration-500">
                    <a href="/dashboard" className="nav-link active">
                        <i className="fad fa-tachometer-alt text-xs mr-2"></i>
                        Dashboard
                    </a>
                </div>
                <div className="mb-3 capitalize font-medium text-sm text-gray-400 hover:text-gray-100 transition ease-in-out duration-500">
                    <a href="/profile" className="nav-link active">
                        <i className="fas fa-user text-xs mr-2"></i>
                        Profile
                    </a>
                </div>
            </div>
            <button
                onClick={toggleSidebar}
                className="absolute top-1/2 right-3 transform translate-x-full -translate-y-1/2 
                bg-gray-600 text-white p-2 shadow-lg hover:bg-teal-700 transition ease-in-out 
                duration-300 rounded-full"
            >
                <i className={`fa fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
            </button>
        </div>
    );
}