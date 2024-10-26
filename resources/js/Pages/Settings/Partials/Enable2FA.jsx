import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';

export default function Enable2FA({ initialIs2FAEnabled }) {
    const [is2FAEnabled, setIs2FAEnabled] = useState(initialIs2FAEnabled);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState('');

    const { setData, processing } = useForm({
        is_2fa_enabled: initialIs2FAEnabled,
    });

    const toggle2FA = async () => {
        try {
            const newState = !is2FAEnabled;
            setData('is_2fa_enabled', newState);

            const response = await axios.post('/api/settings', {
                is_2fa_enabled: newState,
            });

            setIs2FAEnabled(newState);
            setError('');
        } catch (error) {
            setError('Failed to update email authentication settings. Please try again.');
            console.error('Settings update error:', error);
        }
    };

    const instructionSteps = [
        {
            title: 'What is Email Authentication?',
            description: 'A security feature that sends a verification code to your email during sign-in.'
        },
        {
            title: 'Why Enable It?',
            description: 'Adds an extra security layer to protect your account from unauthorized access.'
        },
        {
            title: 'How it Works',
            description: 'Enter the verification code sent to your email to complete the sign-in process.'
        },
        {
            title: 'Key Benefit',
            description: 'Keeps your account secure even if your password is compromised.'
        },
        {
            title: 'Important Note',
            description: 'Verification required when signing in from new devices or browsers.'
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
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>

                        <div className="flex flex-col mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Email Authentication
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
                            {is2FAEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <label 
                            htmlFor="2fa-toggle" 
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="2fa-toggle"
                                className="sr-only peer"
                                checked={is2FAEnabled}
                                onChange={toggle2FA}
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
                title="Email Authentication Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}