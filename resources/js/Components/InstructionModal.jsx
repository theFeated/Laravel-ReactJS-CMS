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
        <>
            <style>
                {`
                    .u-custom-scrollbar {
                        scrollbar-color: rgba(109, 40, 217, 0.5) transparent;
                        scrollbar-width: thin;
                    }
                    .u-custom-scrollbar::-webkit-scrollbar {
                        width: 20px;
                    }
                    .u-custom-scrollbar::-webkit-scrollbar-corner,
                    .u-custom-scrollbar::-webkit-scrollbar-track {
                        background-color: transparent;
                    }
                    .u-custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: rgba(109, 40, 217, 0.5);
                        border-radius: 20px;
                        border: 6px solid transparent;
                        background-clip: content-box;
                    }
                    .u-custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: rgb(109, 40, 217);
                    }
                `}
            </style>
            <div 
                className="fixed inset-0 z-50 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={handleClickOutside}
            >
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black opacity-50" />

                    <div 
                        ref={modalRef}
                        className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-lg"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                {icon}
                                <h2 
                                    id="modal-title"
                                    className="text-2xl font-semibold text-gray-800 dark:text-white"
                                >
                                    {title}
                                </h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto u-custom-scrollbar">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1 text-gray-500 dark:text-gray-300">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}