import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios'; // Import axios for making API calls

export default function Settings({ isGoogleAuthEnabled: initialIsGoogleAuthEnabled }) {
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(initialIsGoogleAuthEnabled);

    const { setData, processing, errors } = useForm({
        is_google_auth_enabled: initialIsGoogleAuthEnabled,
    });

    const toggleGoogleAuth = async () => {
        const newState = !isGoogleAuthEnabled;
        setIsGoogleAuthEnabled(newState);

        setData('is_google_auth_enabled', newState);

        try {
            // Call the API to update the settings
            const response = await axios.post('/api/settings', {
                is_google_auth_enabled: newState,
            });
            console.log(response.data.message); // Display success message
        } catch (error) {
            console.error('There was an error updating the settings', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
        
    );
}
