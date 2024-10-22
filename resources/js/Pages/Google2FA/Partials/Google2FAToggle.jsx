import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';

export default function Google2FAToggle({ initialIsGoogle2FAEnabled }) {
    const [isGoogle2FAEnabled, setIsGoogle2FAEnabled] = useState(initialIsGoogle2FAEnabled || false);
    const { setData, processing, errors, setError } = useForm({
        is_google2fa_enabled: initialIsGoogle2FAEnabled,
    });

    useEffect(() => {
        console.log('Initial isGoogle2FAEnabled:', initialIsGoogle2FAEnabled);
        setIsGoogle2FAEnabled(initialIsGoogle2FAEnabled || false);
    }, [initialIsGoogle2FAEnabled]);

    const handleToggle = async () => {
        const newState = !isGoogle2FAEnabled;
        setData('is_google2fa_enabled', newState);

        try {
            const response = await axios.post('/api/settings', {
                is_google2fa_enabled: newState,
            });
            console.log(response.data.message);
            setIsGoogle2FAEnabled(newState);
        } catch (error) {
            console.error('There was an error updating the settings', error);
            setError('general', 'Failed to update Google 2FA setting.');
        }
    };

    return (
        <div className="setting-item flex items-center mb-4">
            <label htmlFor="google2fa-toggle" className="mr-4 text-gray-700 dark:text-gray-300">
                Enable Google 2FA
            </label>
            <input
                type="checkbox"
                id="google2fa-toggle"
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                checked={isGoogle2FAEnabled} // Ensure checked is always a boolean
                onChange={handleToggle}
                disabled={processing} // Disable interaction during processing
            />
            {/* Render specific error messages safely */}
            {errors.general && (
                <div className="text-red-500 mt-2">
                    {errors.general}
                </div>
            )}
        </div>
    );
}