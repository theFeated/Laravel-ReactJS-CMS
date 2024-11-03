// LoadingAnimation.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoadingAnimation = ({ children, shouldRefresh }) => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/settings'); 
                setLogoUrl(response.data.logo); 
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                // Set loading to false after a short duration
                setTimeout(() => {
                    setLoading(false);

                    // Refresh the page if shouldRefresh is true
                    if (shouldRefresh) {
                        window.location.reload();
                    }
                }, 600); // 0.55 seconds delay enough to show the logo
            }
        };

        fetchLogo();
    }, [shouldRefresh]);

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="flex items-center justify-center h-screen fixed inset-0 z-50 bg-gray-100 dark:bg-gray-800">
                    <div className="relative flex flex-col items-center">
                        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 mb-4">
                            {/* Logo inside the spinner */}
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="rounded-full border-4 border-white shadow-lg h-16 w-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                />
                            )}
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-200">Loading...</p>
                    </div>
                </div>
            )}
            {/* Main Content */}
            {!loading && (
                <div className="absolute inset-0">
                    {children}
                </div>
            )}
        </div>
    );
};

export default LoadingAnimation;