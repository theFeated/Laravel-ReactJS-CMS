// LoadingAnimation.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import loadingMessages from "../../../public/cms/js/loadingmessages";

const LoadingAnimation = ({ children, shouldRefresh }) => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get("/api/settings");
                setLogoUrl(response.data.logo);
            } catch (error) {
                console.error("Error fetching settings:", error);
                // setError("Failed to load logo. Please try again.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    if (shouldRefresh) {
                        window.location.reload();
                    }
                }, 1000);
            }
        };

        // Set a random loading message
        const randomMessage =
            loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setLoadingMessage(randomMessage);

        fetchLogo();
    }, [shouldRefresh]);

    return (
        <div className="relative">
            {loading && (
                <div
                    className="flex items-center justify-center h-screen fixed inset-0 z-50 bg-white dark:bg-gray-800 transition-colors duration-300"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="relative flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-700 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="absolute inset-0 m-auto w-16 h-16 rounded-full object-cover animate-bounce"
                                />
                            )}
                        </div>
                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
                            {loadingMessage}
                        </p>
                        {error && (
                            <p className="mt-2 text-red-500 dark:text-red-400">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {!loading && <div className="absolute inset-0">{children}</div>}
        </div>
    );
};

export default LoadingAnimation;