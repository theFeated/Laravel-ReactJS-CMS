import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InstructionModal from '../../../Components/InstructionModal';
import NotificationManager from "../../../Components/Notification/NotificationManager";
import NotificationHistoryManager from '../../../Components/Notification/NotificationHistoryManager';

export default function EnableManualLogin({ initialIsManualLoginEnabled, userId }) {
    const [isManualLoginEnabled, setIsManualLoginEnabled] = useState(initialIsManualLoginEnabled);
    const [showInstructions, setShowInstructions] = useState(false);
    const notificationManagerRef = useRef(null);
    const notificationHistoryManagerRef = useRef(null);

    const { setData, processing } = useForm({
        is_manual_login_enabled: initialIsManualLoginEnabled,
    });

    const instructionSteps = [
        {
            title: 'What is Manual Login?',
            description: 'Manual login allows you to sign in using your email and password directly on the platform.'
        },
        {
            title: 'Benefits',
            description: 'Provides a traditional login method alongside other authentication options.'
        },
        {
            title: 'When to Use',
            description: 'Useful when you prefer using your account credentials or when alternative login methods are unavailable.'
        },
        {
            title: 'Security Considerations',
            description: 'Ensure you use a strong, unique password and enable two-factor authentication for added security.'
        },
        {
            title: 'Flexibility',
            description: 'You can toggle this setting on or off based on your security preferences.'
        }
    ];

    const toggleManualLogin = async () => {
        const newState = !isManualLoginEnabled;
        setData('is_manual_login_enabled', newState);

        try {
            await axios.post('/api/settings', {
                is_manual_login_enabled: newState,
            });

            setIsManualLoginEnabled(newState);
            const message = newState 
                ? 'Manual Login has been enabled successfully.' 
                : 'Manual Login has been disabled successfully.';

            // Show success notification
            notificationManagerRef.current.addNotification(message, 'success');

            // Save notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(message, 'success');
            }

        } catch (error) {
            console.error('Settings update error:', error);
            const errorMessage = 'Failed to update Manual Login settings. Please try again.';
            notificationManagerRef.current.addNotification(errorMessage, 'error');

            // Save error notification to history
            if (notificationHistoryManagerRef.current) {
                await notificationHistoryManagerRef.current.saveNotification(errorMessage, 'error');
            }
        }
    };

    return (
        <div className="dark:bg-gray-900 p-4 sm:p-6">
            <NotificationManager ref={notificationManagerRef} />
            <NotificationHistoryManager ref={notificationHistoryManagerRef} userId={userId} />
            
            <div className="mt-6 space-y-4 xl:mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-2xl px-4 sm:px-8 py-4 mx-auto border rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 flex-shrink-0" 
                            viewBox="0 0 512 512"
                        >
                            <path 
                                fill="currentColor" 
                                d="M416 448h-64v-64h64v64zm0-128h-64v-64h64v64zm-64-192V64h64v64h-64zM288 448h-64v-64h64v64zm0-128h-64v-64h64v64zm0-128V64h64v64h-64zM160 448h-64v-64h64v64zm0-128h-64v-64h64v64zm0-128V64h64v64h-64zM96 64v64H32V64h64zM32 320h64v64H32v-64zm0-128h64v64H32v-64z"
                            />
                        </svg>
                        <div className="flex flex-col mx-3 sm:mx-5 space-y-1">
                            <h2 className="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                                Manual Login
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-1 text-xs text-blue-500 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                    Account Access
                                </span>
                                <button 
                                    onClick={() => setShowInstructions(true)}
                                    className="px-3 py-1 text-sm text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800 transition"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                        
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                            {isManualLoginEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <label 
                            htmlFor="manual-login-toggle" 
                            className="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                id="manual-login-toggle"
                                className="sr-only peer"
                                checked={isManualLoginEnabled}
                                onChange={toggleManualLogin}
                                disabled={processing}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>
            </div>
    
            <InstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Manual Login Guide"
                icon={<svg className="w-6 h-6 text-blue-500" />}
                steps={instructionSteps}
            />
        </div>
    );
}