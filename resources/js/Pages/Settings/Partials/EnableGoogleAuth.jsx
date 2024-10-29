import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';
import NotificationManager from "../../../Components/Notification/NotificationManager";

export default function EnableGoogleAuth({ initialIsGoogleAuthEnabled }) {
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(initialIsGoogleAuthEnabled);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const notificationManagerRef = useRef();

    const { setData, processing } = useForm({
        is_google_auth_enabled: initialIsGoogleAuthEnabled,
    });

    const instructionSteps = [
        {
            title: 'What is Google Authentication?',
            description: 'A secure way to sign in using your Google account credentials, eliminating the need for separate passwords.'
        },
        {
            title: 'Benefits',
            description: 'Enhanced security, faster login process, and no need to remember additional passwords.'
        },
        {
            title: 'How to Set Up',
            description: 'Enable the feature and sign in with your Google account. You\'ll be prompted to select your Google account when logging in.'
        },
        {
            title: 'Security Tips',
            description: 'Ensure your Google account has strong security settings and two-factor authentication enabled.'
        },
        {
            title: 'Important Note',
            description: 'You\'ll still be able to use your regular account credentials even with Google Authentication enabled.'
        }
    ];

    const toggleGoogleAuth = async () => {
        try {
            const newState = !isGoogleAuthEnabled;
            setData('is_google_auth_enabled', newState);
    
            const response = await axios.post('/api/settings', {
                is_google_auth_enabled: newState,
            });
    
            setIsGoogleAuthEnabled(newState);
    
            // Show success notification
            notificationManagerRef.current.addNotification(
                newState ? 'Google Authentication has been enabled successfully.' : 'Google Authentication has been disabled successfully.',
                'success'
            );
    
        } catch (error) {
            console.error('Settings update error:', error);
    
            // Show error notification
            notificationManagerRef.current.addNotification(
                'Failed to update Google Authentication settings. Please try again.',
                'error'
            );
        }
    };

    return (
        <div className="dark:bg-gray-900">
            <div>
                <NotificationManager ref={notificationManagerRef} />
            </div>
            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-8 h-8 text-gray-400" 
                            viewBox="0 0 488 512"
                        >
                            <path 
                                fill="currentColor" 
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            />
                        </svg>

                        <div className="flex flex-col mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Google Authentication
                            </h2>
                            <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                        Enhanced Security
                                    </span>
                                <button 
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 ml-2 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                        
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isGoogleAuthEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <label 
                            htmlFor="google-auth-toggle" 
                            className="relative inline-flex items-center cursor-pointer"
                            >
                            <input
                                type="checkbox"
                                id="google-auth-toggle"
                                className="sr-only peer"
                                checked={isGoogleAuthEnabled}
                                onChange={toggleGoogleAuth}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>

                    {error && (
                        <div className="max-w-2xl mx-auto px-8">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Google Authentication Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}