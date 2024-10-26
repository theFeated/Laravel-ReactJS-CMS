import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import InstructionModal from '../../../Components/InstructionModal';

export default function Google2FAToggle({ initialIsGoogle2FAEnabled }) {
    const [isGoogle2FAEnabled, setIsGoogle2FAEnabled] = useState(initialIsGoogle2FAEnabled || false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState('');

    const { setData, processing } = useForm({
        is_google2fa_enabled: initialIsGoogle2FAEnabled,
    });

    useEffect(() => {
        setIsGoogle2FAEnabled(initialIsGoogle2FAEnabled || false);
    }, [initialIsGoogle2FAEnabled]);

    const handleToggle = async () => {
        try {
            const newState = !isGoogle2FAEnabled;
            setData('is_google2fa_enabled', newState);

            const response = await axios.post('/api/settings', {
                is_google2fa_enabled: newState,
            });
            
            setIsGoogle2FAEnabled(newState);
            setError('');
        } catch (error) {
            setError('Failed to update authenticator app settings. Please try again.');
            console.error('Settings update error:', error);
        }
    };

    const instructionSteps = [
        {
            title: 'What is Authenticator App?',
            description: 'A secure method that generates time-based verification codes on your mobile device.'
        },
        {
            title: 'Why Use It?',
            description: 'Provides stronger security than SMS or email-based verification methods.'
        },
        {
            title: 'How to Set Up',
            description: 'Download an authenticator app (Google Authenticator, Authy), scan QR code, and enter verification code.'
        },
        {
            title: 'How it Works',
            description: 'Generate a new 6-digit code from your authenticator app each time you sign in.'
        },
        {
            title: 'Important Note',
            description: 'Keep your device secure and backup your recovery codes in case you lose access to your authenticator app.'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-5 h-5 text-gray-400 sm:h-9 sm:w-9" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M3 3h18v18H3z" />
                            <path d="M8 8h8v8H8z" />
                            <path d="M3 12h18" />
                        </svg>

                        <div className="flex flex-col mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Authenticator App
                            </h2>
                            <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                        Enhanced Security
                                    </span>
                                <button 
                                    onClick={() => setShowInstructions(true)}
                                    className="text-sm text-blue-500 hover:text-blue-600 transition"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isGoogle2FAEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <label 
                            htmlFor="google2fa-toggle" 
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="google2fa-toggle"
                                className="sr-only peer"
                                checked={isGoogle2FAEnabled}
                                onChange={handleToggle}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto px-8">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Authenticator App Setup Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}