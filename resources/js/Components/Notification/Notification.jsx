import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Notification({
    id,
    message,
    type,
    onClose,
    displayDuration = 3000, // Default value if not provided
    progressStep = 3.33, // Default value if not provided
}) {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setVisible(true);
        setProgress(100);
    }, [message]);

    useEffect(() => {
        if (!message) return;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(progressInterval);
                    return 0;
                }
                return prev - progressStep;
            });
        }, 100);

        const timer = setTimeout(() => {
            setVisible(false);
            onClose(id);
        }, displayDuration);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [message, id, onClose, displayDuration, progressStep]);

    const handleClose = () => {
        setVisible(false);
        onClose(id);
    };

    if (!visible || !message) return null;

    const getTypeStyle = (type) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800";
            case "error":
                return "bg-red-100 text-red-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getProgressColor = (type) => {
        switch (type) {
            case "success":
                return "bg-green-600"; // A harmonious green that matches success
            case "error":
                return "bg-red-600"; // A harmonious red that matches error
            case "warning":
                return "bg-yellow-600"; // A harmonious yellow that matches warning
            case "info":
                return "bg-blue-600"; // A harmonious blue that matches info
            default:
                return "bg-gray-600"; // Neutral gray for default
        }
    };

    const typeStyle = getTypeStyle(type);
    const progressColor = getProgressColor(type);

    const typeIcons = {
        success: (
            <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        error: (
            <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        warning: (
            <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        info: (
            <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        all: (
            <svg
                className="w-5 h-5 text-white-500"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            </svg>
        ),
    };

    return (
        <div
            className="w-80 animate-fade-in-down"
            role="alert"
            aria-live="assertive"
        >
            <div className={`rounded-lg border shadow-lg ${typeStyle}`}>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center flex-grow">
                        <div className="flex-shrink-0">{typeIcons[type]}</div>
                        <div className="ml-3 mr-2">
                            <p className={`text-xs ${typeStyle}`}>{message}</p>
                        </div>
                    </div>
                    <button
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={handleClose}
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="h-1 w-full rounded-b-lg relative">
                    <div
                        className={`h-full rounded-b-lg transition-all duration-100 ease-linear ${progressColor}`} // Use the progress color based on type
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
