import React, { useEffect, useRef } from 'react';

export default function InstructionModal({ isOpen, onClose, title, icon, steps }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                        aria-label="Close"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 u-custom-scrollbar">
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 font-semibold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-150 ease-in-out"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}