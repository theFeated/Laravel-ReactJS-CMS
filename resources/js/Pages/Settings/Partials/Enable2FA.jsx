import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Enable2FA({ initialIs2FAEnabled }) {
    const [is2FAEnabled, setIs2FAEnabled] = useState(initialIs2FAEnabled);

    const { setData, processing, errors } = useForm({
        is_2fa_enabled: initialIs2FAEnabled,
    });

    const toggle2FA = async () => {
        const newState = !is2FAEnabled; 

        setData('is_2fa_enabled', newState);

        try {
            const response = await axios.post('/api/settings', {
                is_2fa_enabled: newState,
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('There was an error updating the settings', error);
        }
    };

    return (
        <div className="setting-item flex items-center mb-4">
            <label htmlFor="2fa-toggle" className="setting-label text-gray-700 dark:text-gray-300 mr-4">
                Enable Two-Factor Authentication
            </label>
            <input
                type="checkbox"
                id="2fa-toggle"
                className="toggle-checkbox h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                checked={is2FAEnabled} // Controlled input based on the 2FA state
                onChange={toggle2FA} // Trigger toggle on change
                disabled={processing} // Disable input while processing
            />
            {errors.is_2fa_enabled && (
                <div className="text-red-500 text-sm mt-2">{errors.is_2fa_enabled}</div>
            )}
        </div>
    );
}
