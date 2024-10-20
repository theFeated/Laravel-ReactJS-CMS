import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function EnableGoogleAuth({ initialIsGoogleAuthEnabled }) {
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(initialIsGoogleAuthEnabled);

    const { setData, processing, errors } = useForm({
        is_google_auth_enabled: initialIsGoogleAuthEnabled,
    });

    const toggleGoogleAuth = async () => {
        const newState = !isGoogleAuthEnabled;
        setIsGoogleAuthEnabled(newState);

        setData('is_google_auth_enabled', newState);

        try {
            const response = await axios.post('/api/settings', {
                is_google_auth_enabled: newState,
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('There was an error updating the settings', error);
        }
    };

    return (
        <div className="setting-item flex items-center mb-4">
            <label htmlFor="google-auth-toggle" className="setting-label text-gray-700 dark:text-gray-300 mr-4">
                Enable Google Authentication
            </label>
            <input
                type="checkbox"
                id="google-auth-toggle"
                className="toggle-checkbox h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                checked={isGoogleAuthEnabled}
                onChange={toggleGoogleAuth}
                disabled={processing}
            />
            {errors.is_google_auth_enabled && (
                <div className="text-red-500 text-sm mt-2">{errors.is_google_auth_enabled}</div>
            )}
        </div>
    );
}