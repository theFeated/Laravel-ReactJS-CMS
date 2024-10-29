import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faTachometerAlt, 
    faUser, 
    faCog, 
    faChartLine,
    faEnvelope,
    faCalendar,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { usePage } from '@inertiajs/react';

export default function Sidebar({ isOpen, setIsOpen }) {
    const sidebarRef = useRef(null);
    const { props } = usePage();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
                localStorage.setItem('sidebarState', JSON.stringify(false));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen]);

    const NavItem = ({ icon, text, href, onClick }) => (
        <a 
            href={href}
            onClick={onClick}
            className="group flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300
                      text-gray-700 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      hover:shadow-lg transform hover:-translate-y-0.5"
        >
            <div className="flex items-center flex-grow">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg
                               bg-gray-200 dark:bg-gray-700
                               group-hover:bg-opacity-70 transition-colors duration-300">
                    <FontAwesomeIcon 
                        icon={icon} 
                        className="text-gray-600 dark:text-gray-300 group-hover:text-opacity-90 text-lg" 
                    />
                </div>
                <span className="ml-4 font-medium text-lg text-gray-700 dark:text-gray-300 group-hover:text-opacity-90">
                    {text}
                </span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FontAwesomeIcon 
                    icon={faChartLine} 
                    className="text-gray-600 dark:text-gray-400 text-sm" 
                />
            </div>
        </a>
    );

    return (
        <div
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900
                       w-80 transition-transform duration-500 ease-in-out 
                       shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ zIndex: 10 }}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">
                            Hello!
                        </h1>
                    </div>
                    <button 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 
                                 transition-colors duration-300 focus:outline-none focus:ring-2 
                                 focus:ring-gray-300 dark:focus:ring-gray-600"
                        onClick={() => {
                            setIsOpen(false);
                            localStorage.setItem('sidebarState', JSON.stringify(false));
                        }}
                    >
                        <FontAwesomeIcon 
                            icon={faTimes} 
                            className="h-6 w-6 text-gray-600 dark:text-gray-400 
                                     hover:text-gray-800 dark:hover:text-white" 
                        />
                    </button>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="p-6">
                <div className="mb-8">
                    <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 
                                 mb-4 font-semibold">
                        Main Navigation
                    </h2>
                    <NavItem icon={faTachometerAlt} text="Dashboard" href="/dashboard" />
                    <NavItem icon={faUser} text="Profile" href="/profile" />
                    <NavItem icon={faCog} text="Settings" href="/settings" />
                </div>
            </div>
        </div>
    );
}