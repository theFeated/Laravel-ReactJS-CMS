import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';
import NotificationManager from "../../../Components/Notification/NotificationManager";

export default function EnableDarkMode({ initialIsDarkModeEnabled }) {
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(initialIsDarkModeEnabled);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState('');
    const notificationManagerRef = useRef(null);

    const { setData, processing } = useForm({
        is_dark_mode_enabled: initialIsDarkModeEnabled,
    });

    const toggleDarkMode = async () => {
        try {
            const newState = !isDarkModeEnabled;
            setData('is_dark_mode_enabled', newState);

            const response = await axios.post('/api/settings', {
                is_dark_mode_enabled: newState,
            });

            setIsDarkModeEnabled(newState);
            setError('');

            // Apply dark mode class to document element
            if (newState) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Show success notification
            notificationManagerRef.current.addNotification(
                newState ? 'Dark mode has been enabled successfully.' : 'Dark mode has been disabled successfully.',
                'success'
            );

        } catch (error) {
            setError('Failed to update dark mode settings. Please try again.');
            console.error('Settings update error:', error);

            // Show error notification
            notificationManagerRef.current.addNotification(
                'Failed to update dark mode settings. Please try again.',
                'error'
            );
        }
    };

    const instructionSteps = [
        {
            title: 'What is Dark Mode?',
            description: 'Dark mode is a setting that changes the background color of an app window to black. It is designed to reduce eye strain and save battery life on devices with OLED screens.'
        },
        {
            title: 'Why Use It?',
            description: 'Dark mode can reduce eye strain in low-light conditions and can also save battery life on devices with OLED screens.'
        },
        {
            title: 'How to Set Up',
            description: 'Simply toggle the switch to enable or disable dark mode. Your preference will be saved and applied across the application.'
        },
        {
            title: 'How it Works',
            description: 'When dark mode is enabled, the background color of the application changes to a darker color, making it easier on the eyes in low-light conditions.'
        },
        {
            title: 'Important Note',
            description: 'Dark mode is a personal preference and may not be suitable for everyone. You can switch back to light mode at any time.'
        }
    ];

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
                            className="w-5 h-5 text-gray-400 sm:h-9 sm:w-9" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M12 3.75V1.5M12 22.5v-2.25M4.219 4.219l-1.5-1.5M19.781 19.781l-1.5-1.5M1.5 12H3.75M22.5 12h-2.25M4.219 19.781l-1.5 1.5M19.781 4.219l-1.5 1.5M12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" />
                        </svg>

                        <div className="flex flex-col mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Dark Mode
                            </h2>
                            <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                        Enhanced Comfort
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
                    
                    <div className="ms-3 relative">
                        <button
                            onClick={toggleDarkMode}
                            disabled={processing}
                            className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                            aria-label="Toggle dark mode"
                        >
                            <svg className="fill-violet-700 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                            </svg>
                            <svg className="fill-yellow-500 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                    fillRule="evenodd" clipRule="evenodd">
                                </path>
                            </svg>
                        </button>
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
                title="Dark Mode Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}