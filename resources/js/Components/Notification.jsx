import React, { useEffect, useState } from 'react';

export default function Notification({ id, message, type, onClose }) {
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
                return prev - 3.33; // 3 seconds of progress animation
            });
        }, 100);

        const timer = setTimeout(() => {
            setVisible(false);
            onClose(id);
        }, 3000); // 3 seconds of notification display

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [message, id, onClose]);

    const handleClose = () => {
        setVisible(false);
        onClose(id);
    };

    if (!visible || !message) return null;

    return (
        <div className="w-80 animate-fade-in-down">
            <div
                className={`bg-white rounded-lg border shadow-lg ${
                    type === 'success'
                        ? 'border-green-500'
                        : type === 'error'
                        ? 'border-red-500'
                        : 'border-blue-500'
                }`}
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center flex-grow">
                        <div className="flex-shrink-0">
                            {type === 'success' ? (
                                <svg
                                    className="h-5 w-5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            ) : type === 'error' ? (
                                <svg
                                    className="h-5 w-5 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 mr-2">
                            <p className="text-xs text-gray-600">{message}</p>
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
                <div className="h-1 w-full bg-gray-200 rounded-b-lg relative">
                    <div
                        className={`h-full rounded-b-lg transition-all duration-100 ease-linear ${
                            type === 'success'
                                ? 'bg-green-500'
                                : type === 'error'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}